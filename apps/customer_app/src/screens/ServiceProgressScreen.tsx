import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type ChecklistItem = { id: string; label: string; done: boolean };

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "shutoff", label: "Cierre de llave de paso principal", done: true },
  { id: "disassembly", label: "Desmontaje de sifón averiado", done: true },
  { id: "install", label: "Instalación de sifón flexible nuevo", done: true },
  { id: "pressure", label: "Prueba de estanqueidad y presión hidráulica", done: false },
  { id: "cleanup", label: "Limpieza y desinfección del área de trabajo", done: false },
];

type Props = NativeStackScreenProps<RootStackParamList, "ServiceProgress">;

export function ServiceProgressScreen({ navigation, route }: Props): React.JSX.Element {
  const { requestId, technicianId } = route.params;
  const [checklist] = useState(INITIAL_CHECKLIST);
  const [loading, setLoading] = useState(false);
  const completedCount = checklist.filter((item) => item.done).length;

  async function handleFinish() {
    setLoading(true);
    try {
      await api.advanceState(requestId, "COMPLETED");
      navigation.navigate("Payment", { requestId, technicianId, laborCost: 60000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Servicio en Progreso</Text>
      <Text style={styles.subheader}>Reparación de fuga en desagüe y cambio de sifón</Text>

      <View style={styles.securityCard}>
        <Ionicons name="lock-closed" size={18} color={colors.primary} />
        <Text style={styles.securityLabel}>Validación de Acceso Seguro</Text>
        <Text style={styles.pin}>8 4 9 2</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.securityVerified}>Entrada verificada</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Protocolo y Checklist Técnico ({completedCount}/{checklist.length})
      </Text>
      {checklist.map((item) => (
        <View key={item.id} style={styles.checklistRow}>
          <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
            {item.done ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}
          </View>
          <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>{item.label}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.ctaButton} onPress={handleFinish} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="receipt" size={18} color="#FFFFFF" />
            <Text style={styles.ctaText}>Ver resumen y pago</Text>
          </>
        )}
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
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
