import { createServer } from "node:http";
import bcrypt from "bcryptjs";
import express, { Express, NextFunction, Request, Response } from "express";
import { WebSocketServer } from "ws";
import { ZodError } from "zod";
import { AppError } from "../shared/http-error";
import { eventBus, DomainEvents } from "../shared/event-bus";
import { ServiceLifecycleRecord } from "../modules/service_lifecycle/domain/entities/ServiceStateMachine";

import { InMemoryUserRepository } from "../modules/identity/adapters/outbound/InMemoryUserRepository";
import { JwtTokenSigner } from "../modules/identity/adapters/outbound/JwtTokenSigner";
import { RegisterUser } from "../modules/identity/application/use-cases/RegisterUser";
import { LoginUser } from "../modules/identity/application/use-cases/LoginUser";
import { createIdentityRouter } from "../modules/identity/adapters/inbound/identity.router";
import { createAuthMiddleware } from "../modules/identity/adapters/inbound/authMiddleware";

import { InMemoryTradeRepository } from "../modules/catalog/adapters/outbound/InMemoryTradeRepository";
import { ListTrades } from "../modules/catalog/application/use-cases/ListTrades";
import { createCatalogRouter } from "../modules/catalog/adapters/inbound/catalog.router";

import { InMemoryTechnicianProfileRepository } from "../modules/profiles/adapters/outbound/InMemoryTechnicianProfileRepository";
import { ListAvailableTechniciansByTrade } from "../modules/profiles/application/use-cases/ListAvailableTechniciansByTrade";
import { SetAvailability } from "../modules/profiles/application/use-cases/SetAvailability";
import { createProfilesRouter } from "../modules/profiles/adapters/inbound/profiles.router";

import { CatalogTradeCatalogAdapter } from "../modules/diagnosis/adapters/outbound/CatalogTradeCatalogAdapter";
import { ClassifyDamage } from "../modules/diagnosis/application/use-cases/ClassifyDamage";
import { createDiagnosisRouter } from "../modules/diagnosis/adapters/inbound/diagnosis.router";

import { InMemoryServiceRequestRepository } from "../modules/requests/adapters/outbound/InMemoryServiceRequestRepository";
import { DiagnosisClassifierAdapter } from "../modules/requests/adapters/outbound/DiagnosisClassifierAdapter";
import { ServiceLifecycleAdapter } from "../modules/requests/adapters/outbound/ServiceLifecycleAdapter";
import { CreateRequest } from "../modules/requests/application/use-cases/CreateRequest";
import { GetRequest } from "../modules/requests/application/use-cases/GetRequest";
import { createRequestsRouter } from "../modules/requests/adapters/inbound/requests.router";

import { ProfilesTechnicianDirectory } from "../modules/matching/adapters/outbound/ProfilesTechnicianDirectory";
import { ServiceLifecycleTransitionAdapter } from "../modules/matching/adapters/outbound/ServiceLifecycleTransitionAdapter";
import { InMemoryOfferRepository } from "../modules/matching/adapters/outbound/InMemoryOfferRepository";
import { FindCandidates } from "../modules/matching/application/use-cases/FindCandidates";
import { createMatchingRouter } from "../modules/matching/adapters/inbound/matching.router";
import { registerOfferCleanupListener } from "../modules/matching/adapters/inbound/OfferCleanupListener";

import { InMemoryServiceLifecycleRepository } from "../modules/service_lifecycle/adapters/outbound/InMemoryServiceLifecycleRepository";
import { InitializeLifecycle } from "../modules/service_lifecycle/application/use-cases/InitializeLifecycle";
import { TransitionLifecycle } from "../modules/service_lifecycle/application/use-cases/TransitionLifecycle";
import { AcceptService } from "../modules/service_lifecycle/application/use-cases/AcceptService";
import { GetLifecycleState } from "../modules/service_lifecycle/application/use-cases/GetLifecycleState";
import { createServiceLifecycleRouter } from "../modules/service_lifecycle/adapters/inbound/service-lifecycle.router";

import { ComputeFinalAmount } from "../modules/pricing/application/use-cases/ComputeFinalAmount";
import { createPricingRouter } from "../modules/pricing/adapters/inbound/pricing.router";

import { InMemoryPaymentRepository } from "../modules/payments/adapters/outbound/InMemoryPaymentRepository";
import { CapturePayment } from "../modules/payments/application/use-cases/CapturePayment";
import { createPaymentsRouter } from "../modules/payments/adapters/inbound/payments.router";

import { InMemoryRatingRepository } from "../modules/ratings/adapters/outbound/InMemoryRatingRepository";
import { ServiceLifecycleRatedAdapter } from "../modules/ratings/adapters/outbound/ServiceLifecycleRatedAdapter";
import { OpenRatingWindow } from "../modules/ratings/application/use-cases/OpenRatingWindow";
import { SubmitRating } from "../modules/ratings/application/use-cases/SubmitRating";
import { createRatingsRouter } from "../modules/ratings/adapters/inbound/ratings.router";
import { registerPaymentCapturedListener } from "../modules/ratings/adapters/inbound/PaymentCapturedListener";

import { registerNotificationListeners } from "../modules/notifications/adapters/inbound/NotificationListener";

import { createAdminRouter } from "../modules/admin/adapters/inbound/admin.router";

const PORT = Number(process.env.PORT ?? 3000);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-arreglapues";

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  // --- Composición de dependencias por módulo (bootstrap, ADR-0002) ---

  // Identity
  const userRepository = new InMemoryUserRepository();
  const tokenSigner = new JwtTokenSigner(JWT_SECRET);
  const registerUser = new RegisterUser(userRepository, tokenSigner);
  const loginUser = new LoginUser(userRepository, tokenSigner);
  const authMiddleware = createAuthMiddleware(tokenSigner);

  // Usuarios demo de técnicos (app Pro): su id coincide con el `userId` de su
  // perfil en Profiles (tech-1, tech-4), para no exigir un flujo de
  // verificación de identidad completo fuera del alcance de este MVP.
  for (const demo of [
    { id: "tech-1", email: "tecnico1.demo@arreglapues.app", name: "Carlos Restrepo M." },
    { id: "tech-4", email: "tecnico4.demo@arreglapues.app", name: "Andrea Zapata Ríos" },
  ]) {
    userRepository.save({
      id: demo.id,
      email: demo.email,
      passwordHash: bcrypt.hashSync("demo12345", 10),
      name: demo.name,
      role: "PRO",
    });
  }

  // Catalog
  const tradeRepository = new InMemoryTradeRepository();
  const listTrades = new ListTrades(tradeRepository);

  // Profiles
  const technicianRepository = new InMemoryTechnicianProfileRepository();
  const listAvailableTechnicians = new ListAvailableTechniciansByTrade(technicianRepository);
  const setAvailability = new SetAvailability(technicianRepository);

  // Diagnosis (depende de Catalog vía su caso de uso público)
  const tradeCatalogPort = new CatalogTradeCatalogAdapter(listTrades);
  const classifyDamage = new ClassifyDamage(tradeCatalogPort);

  // Service Lifecycle
  const lifecycleRepository = new InMemoryServiceLifecycleRepository();
  const initializeLifecycle = new InitializeLifecycle(lifecycleRepository);
  const transitionLifecycle = new TransitionLifecycle(lifecycleRepository);
  const acceptService = new AcceptService(lifecycleRepository);
  const getLifecycleState = new GetLifecycleState(lifecycleRepository);

  // Requests (depende de Diagnosis y Service Lifecycle vía casos de uso públicos)
  const requestRepository = new InMemoryServiceRequestRepository();
  const damageClassifierPort = new DiagnosisClassifierAdapter(classifyDamage);
  const lifecyclePort = new ServiceLifecycleAdapter(initializeLifecycle);
  const createRequest = new CreateRequest(requestRepository, damageClassifierPort, lifecyclePort);
  const getRequest = new GetRequest(requestRepository);

  // Matching (depende de Profiles y Service Lifecycle vía casos de uso públicos)
  const technicianDirectory = new ProfilesTechnicianDirectory(listAvailableTechnicians);
  const matchingLifecycleTransition = new ServiceLifecycleTransitionAdapter(transitionLifecycle);
  const offerRepository = new InMemoryOfferRepository();
  const findCandidates = new FindCandidates(technicianDirectory, matchingLifecycleTransition, offerRepository);
  registerOfferCleanupListener(offerRepository);

  // Pricing
  const computeFinalAmount = new ComputeFinalAmount();

  // Payments
  const paymentRepository = new InMemoryPaymentRepository();
  const capturePayment = new CapturePayment(paymentRepository);

  // Ratings (depende de Service Lifecycle vía su caso de uso público)
  const ratingRepository = new InMemoryRatingRepository();
  const lifecycleRatedPort = new ServiceLifecycleRatedAdapter(transitionLifecycle);
  const openRatingWindow = new OpenRatingWindow(ratingRepository);
  const submitRating = new SubmitRating(ratingRepository, lifecycleRatedPort);

  // Listeners de eventos de dominio (ADR-0003): efectos secundarios
  // desacoplados que nunca deciden el resultado de la transacción emisora.
  registerPaymentCapturedListener(openRatingWindow);
  registerNotificationListeners();

  // --- Rutas públicas ---
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/v1", createIdentityRouter(registerUser, loginUser));

  // --- Rutas protegidas (identity verifica el token antes que cualquier otro módulo, ADR-0003) ---
  const protectedRouter = express.Router();
  protectedRouter.use(authMiddleware);
  protectedRouter.use(createCatalogRouter(listTrades));
  protectedRouter.use(createProfilesRouter(technicianRepository, setAvailability));
  protectedRouter.use(createDiagnosisRouter(classifyDamage));
  protectedRouter.use(createRequestsRouter(createRequest, getRequest));
  protectedRouter.use(createMatchingRouter(findCandidates, offerRepository));
  protectedRouter.use(createServiceLifecycleRouter(transitionLifecycle, acceptService, getLifecycleState));
  protectedRouter.use(createPricingRouter(computeFinalAmount));
  protectedRouter.use(createPaymentsRouter(capturePayment));
  protectedRouter.use(createRatingsRouter(submitRating));
  protectedRouter.use(createAdminRouter(technicianRepository));
  app.use("/v1", protectedRouter);

  // --- Formato de error consistente (ADR-0003, estilo RFC 7807) ---
  app.use((req: Request, res: Response) => {
    res.status(404).json({ type: "about:blank", title: "not_found", status: 404, detail: `Ruta no encontrada: ${req.method} ${req.path}` });
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express solo reconoce error middleware con 4 parámetros
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.status).json({ type: "about:blank", title: err.code, status: err.status, detail: err.message });
      return;
    }
    if (err instanceof ZodError) {
      res.status(400).json({ type: "about:blank", title: "bad_request", status: 400, detail: err.issues });
      return;
    }
    console.error(err);
    res.status(500).json({ type: "about:blank", title: "internal_error", status: 500, detail: "Error interno del servidor" });
  });

  return app;
}

export function start(port: number = PORT) {
  const app = createApp();
  const server = createServer(app);

  // Canal WebSocket de tracking en tiempo real (ADR-0003): emite el estado
  // del servicio cada vez que cambia en Service Lifecycle.
  const wss = new WebSocketServer({ server, path: "/v1/ws/services" });
  wss.on("connection", (socket, req) => {
    const requestId = new URL(req.url ?? "", "http://localhost").searchParams.get("requestId");
    if (!requestId) {
      socket.close(1008, "Falta requestId");
      return;
    }

    const listener = (record: ServiceLifecycleRecord) => {
      if (record.requestId === requestId) {
        socket.send(JSON.stringify(record));
      }
    };
    eventBus.on(DomainEvents.ServiceStateChanged, listener);
  });

  server.listen(port, () => {
    console.log(`backend escuchando en http://localhost:${port}`);
  });
  return server;
}
