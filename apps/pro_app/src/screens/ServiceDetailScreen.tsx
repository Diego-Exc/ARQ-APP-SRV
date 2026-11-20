import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

const NEXT_STATE: Record<string, { label: string; next: string; icon: keyof typeof Ionicons.glyphMap }> = {
  ASSIGNED: { label: "Salir en camino", next: "EN_ROUTE", icon: "navigate" },
  EN_ROUTE: { label: "Iniciar servicio", next: "IN_PROGRESS", icon: "play" },
  IN_PROGRESS: { label: "Finalizar servicio", next: "COMPLETED", icon: "checkmark-done" },
};

const STATE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  ASSIGNED: "person-add",
  EN_ROUTE: "car",
  IN_PROGRESS: "construct",
  COMPLETED: "checkmark-circle",
};

type Props = NativeStackScreenProps<RootStackParamList, "ServiceDetail">;

export function ServiceDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { requestId } = route.params;
  const [state, setState] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);

  const action = NEXT_STATE[state];

  async function handleAdvance() {
    if (!action) return;
    setLoading(true);
    try {
      const updated = await proApi.advanceState(requestId, action.next);
      setState(updated.state);
    } catch (error) {
      Alert.alert("No se pudo actualizar el estado", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Servicio en curso</Text>
      <Text style={styles.requestId}>Solicitud {requestId}</Text>

      <View style={styles.stateCard}>
        <Ionicons name={STATE_ICON[state] ?? "information-circle"} size={28} color={colors.primary} />
        <Text style={styles.stateLabel}>Estado actual</Text>
        <Text style={styles.stateValue}>{state}</Text>
      </View>

      {action ? (
        <TouchableOpacity style={styles.ctaButton} onPress={handleAdvance} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name={action.icon} size={18} color="#FFFFFF" />
              <Text style={styles.ctaText}>{action.label}</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.doneBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.doneText}>Servicio finalizado. Esperando el pago del cliente en la app ArreglaPues.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backRow} onPress={() => navigation.navigate("MainTabs")}>
        <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
        <Text style={styles.backLink}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  requestId: { color: colors.textSecondary, marginTop: 4, marginBottom: 20, fontSize: 12 },
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  stateLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 6 },
  stateValue: { color: colors.primary, fontWeight: "700", fontSize: 18, marginTop: 4 },
  ctaButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
  doneBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14 },
  doneText: { color: colors.success, fontWeight: "600", flex: 1 },
  backRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 },
  backLink: { color: colors.textSecondary, textDecorationLine: "underline" },
});
