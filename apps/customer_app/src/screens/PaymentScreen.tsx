import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { paymentSummary } from "../data/mock";
import { formatCOP } from "../utils/format";

type Props = {
  navigation: { navigate: (screen: string) => void };
};

const PAYMENT_METHODS = ["Nequi", "PSE", "Tarjeta débito/crédito", "Efectivo al técnico"];
const TIP_OPTIONS = [3000, 5000, 10000];

export function PaymentScreen({ navigation }: Props): JSX.Element {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [tip, setTip] = useState(5000);

  const total = paymentSummary.total + tip;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Resumen y Pago</Text>

      <View style={styles.breakdownCard}>
        <Row label="Visita técnica y mano de obra" value={paymentSummary.laborCost} />
        <Row label="Repuestos y materiales suministrados" value={paymentSummary.materialsCost} />
        <Row label="Cupón de bienvenida" value={paymentSummary.serviceFee} />
        <Row label="Propina para el técnico" value={tip} />
        <View style={styles.divider} />
        <Row label="Total a pagar" value={total} bold />
      </View>

      <Text style={styles.sectionTitle}>Propina</Text>
      <View style={styles.tipRow}>
        {TIP_OPTIONS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.tipChip, tip === amount && styles.tipChipActive]}
            onPress={() => setTip(amount)}
          >
            <Text style={[styles.tipChipText, tip === amount && styles.tipChipTextActive]}>
              {formatCOP(amount)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Método de Pago</Text>
      {PAYMENT_METHODS.map((method) => (
        <TouchableOpacity
          key={method}
          style={[styles.methodRow, selectedMethod === method && styles.methodRowActive]}
          onPress={() => setSelectedMethod(method)}
        >
          <Text style={styles.methodLabel}>{method}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.guaranteeBox}>
        <Text style={styles.guaranteeTitle}>Garantía Hogar+ por 30 días</Text>
        <Text style={styles.guaranteeText}>
          Si la fuga persiste o el problema no quedó resuelto, reagendamos sin costo.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.ctaText}>Pagar {formatCOP(total)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }): JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowBold]}>{formatCOP(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { color: colors.textSecondary },
  rowValue: { color: colors.textPrimary },
  rowBold: { fontWeight: "700", color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  sectionTitle: { fontWeight: "700", color: colors.textPrimary, marginBottom: 8, marginTop: 8 },
  tipRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  tipChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tipChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tipChipText: { color: colors.textPrimary, fontSize: 12 },
  tipChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  methodRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  methodRowActive: { borderColor: colors.primary, borderWidth: 2 },
  methodLabel: { color: colors.textPrimary, fontWeight: "600" },
  guaranteeBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 12,
    marginVertical: 14,
  },
  guaranteeTitle: { color: colors.success, fontWeight: "700" },
  guaranteeText: { color: colors.textPrimary, marginTop: 2, fontSize: 12 },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
