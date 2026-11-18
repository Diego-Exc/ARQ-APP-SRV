import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

const STEPS = [
  { key: "ASSIGNED", label: "Aceptado" },
  { key: "EN_ROUTE", label: "En camino" },
  { key: "IN_PROGRESS", label: "En progreso" },
  { key: "COMPLETED", label: "Finalizado" },
];

type Props = NativeStackScreenProps<RootStackParamList, "Tracking">;

export function TrackingScreen({ navigation, route }: Props): JSX.Element {
  const { requestId, technicianId, technicianName } = route.params;
  const [state, setState] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);

  // Canal en tiempo real (ADR-0003): el estado se refleja apenas el backend
  // lo cambia, sin necesidad de polling (escenario de calidad U2).
  useEffect(() => {
    const close = api.openServiceSocket(requestId, (lifecycle) => setState(lifecycle.state));
    // El técnico "sale en camino" automáticamente al confirmar la asignación,
    // simulando la actualización que en producción enviaría la app Pro.
    api.advanceState(requestId, "EN_ROUTE").catch(() => undefined);
    return close;
  }, [requestId]);

  const currentIndex = STEPS.findIndex((step) => step.key === state);

  async function handleContinue() {
    setLoading(true);
    try {
      await api.advanceState(requestId, "IN_PROGRESS");
      navigation.navigate("ServiceProgress", { requestId, technicianId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapLabel}>Mapa en vivo · {technicianName} en camino</Text>
      </View>

      <View style={styles.stepper}>
        {STEPS.map((step, index) => (
          <View key={step.key} style={styles.stepperItem}>
            <View style={[styles.stepDot, index <= currentIndex && styles.stepDotActive]} />
            <Text style={styles.stepLabel}>{step.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.driverCard}>
        <Text style={styles.driverName}>{technicianName}</Text>
        <Text style={styles.driverMeta}>Estado actual: {state}</Text>

        <View style={styles.securityBox}>
          <Text style={styles.securityLabel}>Código de Seguridad</Text>
          <Text style={styles.securityCode}>8492</Text>
          <Text style={styles.securityHint}>Pídeselo al técnico antes de abrir la puerta</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleContinue} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Ver servicio en progreso</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapPlaceholder: {
    height: 220,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  mapLabel: { color: colors.primary, fontWeight: "600" },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  stepperItem: { alignItems: "center", flex: 1 },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  stepDotActive: { backgroundColor: colors.success },
  stepLabel: { fontSize: 10, color: colors.textSecondary, textAlign: "center" },
  driverCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    flex: 1,
  },
  driverName: { fontWeight: "700", fontSize: 16, color: colors.textPrimary },
  driverMeta: { color: colors.textSecondary, marginTop: 2 },
  securityBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    alignItems: "center",
  },
  securityLabel: { color: colors.textSecondary, fontSize: 12 },
  securityCode: { fontSize: 28, fontWeight: "700", color: colors.primary, letterSpacing: 6 },
  securityHint: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
