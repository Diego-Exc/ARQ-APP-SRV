import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { formatCOP } from "../utils/format";
import { api, PricingBreakdown } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

const PAYMENT_METHODS = ["Nequi", "PSE", "Tarjeta débito/crédito", "Efectivo al técnico"];
const TIP_OPTIONS = [3000, 5000, 10000];
const MATERIALS_COST = 22000;
const WELCOME_DISCOUNT = 10000;

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

export function PaymentScreen({ navigation, route }: Props): JSX.Element {
  const { requestId, technicianId, laborCost } = route.params;
  const [breakdown, setBreakdown] = useState<PricingBreakdown | null>(null);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [tip, setTip] = useState(5000);
  const [paying, setPaying] = useState(false);
  // Clave de idempotencia estable por servicio (escenario S2): reintentar el
  // pago nunca genera un doble cobro.
  const idempotencyKey = useRef(`pay-${requestId}`);

  useEffect(() => {
    api.pricingQuote(laborCost, MATERIALS_COST, WELCOME_DISCOUNT).then(setBreakdown);
  }, [laborCost]);

  if (!breakdown) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const total = breakdown.total.amount + tip;

  async function handlePay() {
    setPaying(true);
    try {
      await api.capturePayment(requestId, idempotencyKey.current, total, selectedMethod);
      await api.submitRating(requestId, technicianId, 5, "Excelente servicio, gracias ArreglaPues");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("No se pudo procesar el pago", (error as Error).message);
    } finally {
      setPaying(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Resumen y Pago</Text>

      <View style={styles.breakdownCard}>
        <Row label="Visita técnica y mano de obra" value={breakdown.laborCost.amount} />
        <Row label="Repuestos y materiales suministrados" value={breakdown.materialsCost.amount} />
        <Row label="Cupón de bienvenida" value={breakdown.discount.amount} />
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
            <Text style={[styles.tipChipText, tip === amount && styles.tipChipTextActive]}>{formatCOP(amount)}</Text>
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
        <Text style={styles.guaranteeTitle}>Garantía ArreglaPues por 30 días</Text>
        <Text style={styles.guaranteeText}>
          Si la fuga persiste o el problema no quedó resuelto, reagendamos sin costo.
        </Text>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handlePay} disabled={paying}>
        {paying ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Pagar {formatCOP(total)}</Text>}
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
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
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
