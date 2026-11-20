import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { formatCOP } from "../utils/format";
import { categories } from "../data/mock";
import { api } from "../api/client";
import { CLIENT_LOCATION } from "../data/location";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Diagnosis">;

export function DiagnosisScreen({ navigation, route }: Props): React.JSX.Element {
  const { requestId, tradeId, tradeName, confidence, urgency, urgencyReason, description } = route.params;
  const [loading, setLoading] = useState(false);

  const priceFrom = categories.find((c) => c.id === tradeId)?.priceFrom ?? 45000;

  async function handleSearchTechnicians() {
    if (!tradeId) {
      Alert.alert(
        "Selecciona un oficio",
        "La IA no identificó el oficio con certeza; vuelve al inicio y descríbelo con más detalle.",
      );
      return;
    }
    setLoading(true);
    try {
      const result = await api.findCandidates(requestId, tradeId, CLIENT_LOCATION);
      navigation.navigate("Technicians", { requestId, candidates: result.candidates });
    } catch (error) {
      Alert.alert("No hay técnicos disponibles", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Diagnóstico IA del Daño</Text>
      <Text style={styles.timestamp}>Reportado ahora</Text>

      <View style={styles.reportCard}>
        <Text style={styles.reportLabel}>Tu descripción reportada</Text>
        <Text style={styles.reportText}>"{description}"</Text>
      </View>

      <View style={styles.confidenceRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="sparkles" size={16} color={colors.success} />
          <Text style={styles.confidenceLabel}>Análisis IA completado</Text>
        </View>
        <Text style={styles.confidenceValue}>{Math.round(confidence * 100)}% certeza</Text>
      </View>

      <View style={styles.urgencyCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="warning" size={16} color={colors.danger} />
          <Text style={styles.urgencyTitle}>{urgency}</Text>
        </View>
        <Text style={styles.urgencyReason}>{urgencyReason}</Text>
      </View>

      <View style={styles.tradeCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="construct" size={16} color={colors.primary} />
          <Text style={styles.tradeLabel}>Oficio recomendado</Text>
        </View>
        <Text style={styles.tradeName}>{tradeName ?? "No identificado"}</Text>
        {tradeId ? <Text style={styles.tradePrice}>Desde {formatCOP(priceFrom)}</Text> : null}
        <Text style={styles.tradeHint}>Tarifa estimada mano de obra (mano de obra base)</Text>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handleSearchTechnicians} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.ctaText}>Buscar técnicos verificados</Text>
          </>
        )}
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
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
  manualLink: { color: colors.textSecondary, textAlign: "center", textDecorationLine: "underline" },
});
