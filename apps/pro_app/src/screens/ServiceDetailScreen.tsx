import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { proApi } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

const NEXT_STATE: Record<string, { label: string; next: string }> = {
  ASSIGNED: { label: "Salir en camino", next: "EN_ROUTE" },
  EN_ROUTE: { label: "Iniciar servicio", next: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Finalizar servicio", next: "COMPLETED" },
};

type Props = NativeStackScreenProps<RootStackParamList, "ServiceDetail">;

export function ServiceDetailScreen({ navigation, route }: Props): JSX.Element {
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
        <Text style={styles.stateLabel}>Estado actual</Text>
        <Text style={styles.stateValue}>{state}</Text>
      </View>

      {action ? (
        <TouchableOpacity style={styles.ctaButton} onPress={handleAdvance} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>{action.label}</Text>}
        </TouchableOpacity>
      ) : (
        <View style={styles.doneBox}>
          <Text style={styles.doneText}>Servicio finalizado. Esperando el pago del cliente en la app ArreglaPues.</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.popToTop()}>
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
  stateLabel: { color: colors.textSecondary, fontSize: 12 },
  stateValue: { color: colors.primary, fontWeight: "700", fontSize: 18, marginTop: 4 },
  ctaButton: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
  doneBox: { backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14 },
  doneText: { color: colors.success, fontWeight: "600" },
  backLink: { color: colors.textSecondary, textAlign: "center", textDecorationLine: "underline", marginTop: 20 },
});
