import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

type Props = {
  navigation: { navigate: (screen: string) => void };
};

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "shutoff", label: "Cierre de llave de paso principal", done: true },
  { id: "disassembly", label: "Desmontaje de sifón averiado", done: true },
  { id: "install", label: "Instalación de sifón flexible nuevo", done: true },
  { id: "pressure", label: "Prueba de estanqueidad y presión hidráulica", done: false },
  { id: "cleanup", label: "Limpieza y desinfección del área de trabajo", done: false },
];

export function ServiceProgressScreen({ navigation }: Props): JSX.Element {
  const [checklist] = useState(INITIAL_CHECKLIST);
  const completedCount = checklist.filter((item) => item.done).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Servicio en Progreso</Text>
      <Text style={styles.subheader}>
        Reparación de fuga en desagüe y cambio de sifón
      </Text>

      <View style={styles.securityCard}>
        <Text style={styles.securityLabel}>Validación de Acceso Seguro</Text>
        <Text style={styles.pin}>8 4 9 2</Text>
        <Text style={styles.securityVerified}>Entrada verificada</Text>
      </View>

      <Text style={styles.sectionTitle}>
        Protocolo y Checklist Técnico ({completedCount}/{checklist.length})
      </Text>
      {checklist.map((item) => (
        <View key={item.id} style={styles.checklistRow}>
          <View style={[styles.checkbox, item.done && styles.checkboxDone]} />
          <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>
            {item.label}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate("Payment")}
      >
        <Text style={styles.ctaText}>Ver resumen y pago</Text>
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
  },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  checklistLabel: { color: colors.textPrimary, flex: 1 },
  checklistLabelDone: { color: colors.textSecondary, textDecorationLine: "line-through" },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
