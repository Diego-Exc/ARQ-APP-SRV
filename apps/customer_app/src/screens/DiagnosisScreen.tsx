import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { diagnosis } from "../data/mock";
import { formatCOP } from "../utils/format";

type Props = {
  navigation: { navigate: (screen: string) => void };
};

export function DiagnosisScreen({ navigation }: Props): JSX.Element {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Diagnóstico IA del Daño</Text>
      <Text style={styles.timestamp}>{diagnosis.reportedAt}</Text>

      <View style={styles.reportCard}>
        <Text style={styles.reportLabel}>Tu descripción reportada</Text>
        <Text style={styles.reportText}>"{diagnosis.description}"</Text>
      </View>

      <View style={styles.confidenceRow}>
        <Text style={styles.confidenceLabel}>Análisis IA completado</Text>
        <Text style={styles.confidenceValue}>{Math.round(diagnosis.confidence * 100)}% certeza</Text>
      </View>

      <View style={styles.urgencyCard}>
        <Text style={styles.urgencyTitle}>{diagnosis.urgency}</Text>
        <Text style={styles.urgencyReason}>{diagnosis.urgencyReason}</Text>
      </View>

      <View style={styles.tradeCard}>
        <Text style={styles.tradeLabel}>Oficio recomendado</Text>
        <Text style={styles.tradeName}>{diagnosis.trade}</Text>
        <Text style={styles.tradePrice}>
          {formatCOP(diagnosis.priceRangeMin)} – {formatCOP(diagnosis.priceRangeMax)}
        </Text>
        <Text style={styles.tradeHint}>Tarifa estimada mano de obra (mano de obra base)</Text>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate("Technicians")}
      >
        <Text style={styles.ctaText}>Buscar técnicos verificados</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.manualLink}>No parece correcto, elegir oficio manualmente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  timestamp: { color: colors.textSecondary, marginBottom: 12 },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  reportLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 4 },
  reportText: { color: colors.textPrimary, fontStyle: "italic" },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  confidenceLabel: { color: colors.textPrimary, fontWeight: "600" },
  confidenceValue: { color: colors.success, fontWeight: "700" },
  urgencyCard: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  urgencyTitle: { color: colors.danger, fontWeight: "700" },
  urgencyReason: { color: colors.textPrimary, marginTop: 2 },
  tradeCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
  },
  tradeLabel: { color: colors.textSecondary, fontSize: 12 },
  tradeName: { color: colors.primary, fontWeight: "700", fontSize: 16, marginTop: 2 },
  tradePrice: { color: colors.textPrimary, fontWeight: "700", marginTop: 8 },
  tradeHint: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
  manualLink: { color: colors.textSecondary, textAlign: "center", textDecorationLine: "underline" },
});
