import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { ServiceMap } from "../components/ServiceMap";
import { api } from "../api/client";
import { CLIENT_LOCATION, lerpPoint, technicianStartPoint } from "../data/location";
import type { RootStackParamList } from "../navigation/AppNavigator";

const STEPS = [
  { key: "ASSIGNED", label: "Aceptado" },
  { key: "EN_ROUTE", label: "En camino" },
  { key: "IN_PROGRESS", label: "En progreso" },
  { key: "COMPLETED", label: "Finalizado" },
];

// El técnico "avanza" hacia el cliente en función del estado del ciclo de
// vida (datos de ubicación simulados, ver ADR-0005 y src/data/location.ts).
const PROGRESS_BY_STATE: Record<string, number> = {
  ASSIGNED: 0,
  EN_ROUTE: 0.6,
  IN_PROGRESS: 1,
  COMPLETED: 1,
};

type Props = NativeStackScreenProps<RootStackParamList, "Tracking">;

export function TrackingScreen({ navigation, route }: Props): React.JSX.Element {
  const { requestId, technicianId, technicianName, distanceKm } = route.params;
  const [state, setState] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);

  const technicianOrigin = useMemo(() => technicianStartPoint(distanceKm), [distanceKm]);
  const progress = PROGRESS_BY_STATE[state] ?? 0;
  const technicianPosition = lerpPoint(technicianOrigin, CLIENT_LOCATION, progress);

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
      <View style={styles.mapWrapper}>
        <ServiceMap home={CLIENT_LOCATION} technician={technicianPosition} style={styles.map} />
        <View style={styles.mapBadge}>
          <Text style={styles.mapBadgeText}>{technicianName} en camino</Text>
        </View>
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
        <View style={styles.driverHeader}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={20} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>{technicianName}</Text>
            <Text style={styles.driverMeta}>Estado actual: {state}</Text>
          </View>
        </View>

        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
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
  mapWrapper: { height: 240 },
  map: { flex: 1 },
  mapBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mapBadgeText: { color: "#FFFFFF", fontWeight: "600", fontSize: 12 },
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  pinHome: { backgroundColor: colors.primary },
  pinTechnician: { backgroundColor: colors.accent },
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
  driverHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
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
  securityLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
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
