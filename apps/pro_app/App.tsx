import React, { useEffect } from "react";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Ver nota equivalente en apps/customer_app/App.tsx: evita que el botón
    // Atrás del navegador (web) restaure desde bfcache una pantalla privada
    // tal como quedó justo antes de cerrar sesión.
    if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return <AppNavigator />;
}
