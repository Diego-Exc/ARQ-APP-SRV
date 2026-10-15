import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 3000);

export function createApp() {
  return createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not_found" }));
  });
}

export function start(port: number = PORT) {
  const app = createApp();
  app.listen(port, () => {
    console.log(`backend escuchando en http://localhost:${port}`);
  });
  return app;
}
