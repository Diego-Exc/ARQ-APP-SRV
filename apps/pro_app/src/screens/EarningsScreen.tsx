import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { formatCOP } from "../utils/format";
import { earningsSummary, earningsHistory } from "../data/mock";

const RANGES: { key: "today" | "week" | "month"; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Esta semana" },
  { key: "month", label: "Este mes" },
];

export function EarningsScreen(): React.JSX.Element {
  const [range, setRange] = useState<"today" | "week" | "month">("week");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Mis ganancias</Text>

      <View style={styles.summaryCard}>
        <View style={styles.rangeTabs}>
          {RANGES.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.rangeTab, range === item.key && styles.rangeTabActive]}
              onPress={() => setRange(item.key)}
            >
              <Text style={[styles.rangeTabText, range === item.key && styles.rangeTabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.summaryAmount}>{formatCOP(earningsSummary[range])}</Text>
        <Text style={styles.summaryHint}>Total generado en el periodo seleccionado</Text>
      </View>

      <View style={styles.payoutCard}>
        <View style={styles.payoutIcon}>
          <Ionicons name="wallet" size={22} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.payoutLabel}>Saldo pendiente por retirar</Text>
          <Text style={styles.payoutAmount}>{formatCOP(earningsSummary.pendingPayout)}</Text>
        </View>
        <TouchableOpacity style={styles.payoutButton}>
          <Text style={styles.payoutButtonText}>Retirar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Historial reciente</Text>
      {earningsHistory.map((entry) => (
        <View key={entry.id} style={styles.historyRow}>
          <View style={styles.historyIcon}>
            <Ionicons name="checkmark-done" size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyLabel}>{entry.label}</Text>
            <Text style={styles.historyDate}>{entry.date}</Text>
          </View>
          <Text style={styles.historyAmount}>+{formatCOP(entry.amount)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 14 },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  rangeTabs: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 3, marginBottom: 16 },
  rangeTab: { flex: 1, paddingVertical: 7, alignItems: "center", borderRadius: 8 },
  rangeTabActive: { backgroundColor: colors.accent },
  rangeTabText: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600" },
  rangeTabTextActive: { color: "#FFFFFF" },
  summaryAmount: { color: "#FFFFFF", fontSize: 30, fontWeight: "800" },
  summaryHint: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },
  payoutCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  payoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutLabel: { color: colors.textSecondary, fontSize: 12 },
  payoutAmount: { color: colors.textPrimary, fontWeight: "700", fontSize: 16, marginTop: 2 },
  payoutButton: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  payoutButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  sectionTitle: { fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  historyLabel: { color: colors.textPrimary, fontWeight: "600", fontSize: 13 },
  historyDate: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  historyAmount: { color: colors.success, fontWeight: "700" },
});
