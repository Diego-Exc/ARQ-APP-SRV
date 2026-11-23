import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi } from "../api/client";
import { showAlert } from "../utils/alert";
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
  const [state, setState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    // Antes esta pantalla siempre arrancaba en "ASSIGNED" sin consultar el
    // backend: si el tecnico recargaba a mitad de servicio, veia un estado
    // desactualizado. Ahora carga el estado real al montar.
    proApi
      .getServiceState(requestId)
      .then((lifecycle) => setState(lifecycle.state))
      .catch(() => setState("ASSIGNED"));
  }, [requestId]);

  const action = state ? NEXT_STATE[state] : undefined;
  const needsCode = action?.next === "IN_PROGRESS";

  async function handleAdvance() {
    if (!action) return;
    if (needsCode && codeInput.trim().length === 0) {
      showAlert("Falta el código", "Pídele al cliente el código de seguridad antes de iniciar.");
      return;
    }
    setLoading(true);
    try {
      const updated = await proApi.advanceState(requestId, action.next, needsCode ? codeInput.trim() : undefined);
      setState(updated.state);
      setCodeInput("");
    } catch (error) {
      showAlert("No se pudo actualizar el estado", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (state === null) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
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

      {needsCode ? (
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Código de seguridad del cliente</Text>
          <TextInput
            style={styles.codeInput}
            value={codeInput}
            onChangeText={setCodeInput}
            placeholder="4 dígitos"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      ) : null}

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
  codeBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  codeLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 8 },
  codeInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    letterSpacing: 6,
    color: colors.textPrimary,
  },
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
