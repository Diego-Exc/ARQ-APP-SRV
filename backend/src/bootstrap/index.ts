import { start } from "./server";

// Punto de composición del backend (ADR 002): aquí se conectarán los puertos
// de cada módulo con sus adaptadores concretos a medida que se implementen.
start().catch((error) => {
  console.error("No se pudo iniciar el backend:", error);
  process.exit(1);
});
