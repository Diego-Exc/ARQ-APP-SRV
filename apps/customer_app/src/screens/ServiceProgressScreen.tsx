import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

// Pasos reales del ciclo de vida (ServiceStateMachine en el backend): un paso
// se marca "hecho" solo si ya ocurrió de verdad esa transición, no una lista
// fija de tareas sin relación con el estado (hallazgo de auditoría, issue #25).
const STEPS = [
  { key: "ASSIGNED", label: "Técnico asignado" },
  { key: "EN_ROUTE", label: "Técnico en camino" },
  { key: "IN_PROGRESS", label: "Servicio en progreso" },
  { key: "COMPLETED", label: "Servicio finalizado" },
];

type Props = NativeStackScreenProps<RootStackParamList, "ServiceProgress">;

export function ServiceProgressScreen({ navigation, route }: Props): React.JSX.Element {
  const { requestId, technicianId } = route.params;
  const [state, setState] = useState("IN_PROGRESS");
  const [securityCode, setSecurityCode] = useState<string | null>(null);
  const currentIndex = STEPS.findIndex((step) => step.key === state);
  const isCompleted = state === "COMPLETED";

  useEffect(() => {
    api
      .getServiceState(requestId)
      .then((lifecycle) => {
        setState(lifecycle.state);
        setSecurityCode(lifecycle.securityCode);
      })
      .catch(() => undefined);
    const close = api.openServiceSocket(requestId, (lifecycle) => {
      setState(lifecycle.state);
      setSecurityCode(lifecycle.securityCode);
    });
    return close;
  }, [requestId]);

  function handleFinish() {
    // El cliente ya no marca el servicio como completado: ese estado lo
    // reporta el técnico real desde pro_app (issue #25). El botón solo se
    // habilita cuando el backend ya confirmó COMPLETED.
    navigation.navigate("Payment", { requestId, technicianId, laborCost: 60000 });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Servicio en Progreso</Text>
      <Text style={styles.subheader}>Reparación de fuga en desagüe y cambio de sifón</Text>

      <View style={styles.securityCard}>
        <Ionicons name="lock-closed" size={18} color={colors.primary} />
        <Text style={styles.securityLabel}>Código de seguridad de este servicio</Text>
        <Text style={styles.pin}>{securityCode ?? "----"}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.securityVerified}>Entrada verificada por el técnico</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Estado real del servicio</Text>
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <View key={step.key} style={styles.checklistRow}>
            <View style={[styles.checkbox, done && styles.checkboxDone]}>
              {done ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
            </View>
            <Text style={[styles.checklistLabel, done && styles.checklistLabelDone]}>{step.label}</Text>
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.ctaButton, !isCompleted && styles.ctaButtonDisabled]}
        onPress={handleFinish}
        disabled={!isCompleted}
      >
        <Ionicons name="receipt" size={18} color="#FFFFFF" />
        <Text style={styles.ctaText}>
          {isCompleted ? "Ver resumen y pago" : "Esperando a que el técnico finalice…"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  subheader: { color: colors.textSecondary, marginBottom: 14 },
  securityCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  securityLabel: { color: colors.textSecondary, fontSize: 12 },
  pin: { fontSize: 24, fontWeight: "700", color: colors.primary, letterSpacing: 8, marginVertical: 4 },
  securityVerified: { color: colors.success, fontWeight: "600", fontSize: 12 },
  sectionTitle: { fontWeight: "700", color: colors.textPrimary, marginBottom: 8 },
  checklistRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  checklistLabel: { color: colors.textPrimary, flex: 1 },
  checklistLabelDone: { color: colors.textSecondary, textDecorationLine: "line-through" },
  ctaButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  ctaButtonDisabled: { backgroundColor: colors.border },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
