import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { restoreSession } from "./src/api/client";
import { colors } from "./src/theme/colors";

export default function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<"Home" | "Login" | null>(null);

  useEffect(() => {
    setInitialRoute(restoreSession() ? "Home" : "Login");
  }, []);

  useEffect(() => {
    // En web, el botón Atrás del navegador puede restaurar una página desde
    // bfcache (memoria viva, sin re-ejecutar el JS) tal como quedó antes de
    // navegar fuera — incluso si en el momento de volver ya se cerró sesión
    // en otra pestaña/ventana. Forzar un reload real cuando esto pasa hace
    // que vuelva a correr restoreSession() y respete la sesión actual.
    if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <AppNavigator initialRouteName={initialRoute} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
});
