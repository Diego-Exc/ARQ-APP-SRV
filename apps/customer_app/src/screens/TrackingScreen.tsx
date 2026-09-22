import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { technicians } from "../data/mock";

type Props = {
  navigation: { navigate: (screen: string) => void };
};

const STATUSES = ["Solicitado", "Aceptado", "En camino", "En progreso", "Finalizado"];
const CURRENT_STATUS_INDEX = 2;

export function TrackingScreen({ navigation }: Props): JSX.Element {
  const technician = technicians[0];

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapLabel}>Mapa en vivo · {technician.name} en camino</Text>
      </View>

      <View style={styles.stepper}>
        {STATUSES.map((status, index) => (
          <View key={status} style={styles.stepperItem}>
            <View
              style={[
                styles.stepDot,
                index <= CURRENT_STATUS_INDEX && styles.stepDotActive,
              ]}
            />
            <Text style={styles.stepLabel}>{status}</Text>
          </View>
        ))}
      </View>

      <View style={styles.driverCard}>
        <Text style={styles.driverName}>{technician.name}</Text>
        <Text style={styles.driverMeta}>★ {technician.rating.toFixed(2)} · {technician.reviews} servicios</Text>
        <Text style={styles.eta}>Llegada estimada: {technician.etaMinutes} min</Text>

        <View style={styles.securityBox}>
          <Text style={styles.securityLabel}>Código de Seguridad</Text>
          <Text style={styles.securityCode}>8492</Text>
          <Text style={styles.securityHint}>Pídeselo al técnico antes de abrir la puerta</Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("ServiceProgress")}
        >
          <Text style={styles.ctaText}>Ver servicio en progreso</Text>
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
  eta: { color: colors.primary, fontWeight: "600", marginTop: 6 },
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
