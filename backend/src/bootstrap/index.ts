import { start } from "./server";

// Punto de composición del backend (ADR 002): aquí se conectarán los puertos
// de cada módulo con sus adaptadores concretos a medida que se implementen.
start();
