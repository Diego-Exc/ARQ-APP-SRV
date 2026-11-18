import React, { useState } from "react";
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { api, Candidate } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Technicians">;

export function TechnicianListScreen({ navigation, route }: Props): JSX.Element {
  const { requestId, candidates } = route.params;
  const [autoAssign, setAutoAssign] = useState(true);
  const [selectedId, setSelectedId] = useState<string>(candidates[0]?.technicianId ?? "");
  const [loading, setLoading] = useState(false);

  const selected = candidates.find((c) => c.technicianId === selectedId);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    try {
      await api.acceptService(requestId, selected.technicianId);
      navigation.navigate("Tracking", {
        requestId,
        technicianId: selected.technicianId,
        technicianName: selected.name,
      });
    } catch (error) {
      Alert.alert("No se pudo confirmar el técnico", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Técnicos en tu zona</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Asignación Inteligente Rápida</Text>
        <Switch value={autoAssign} onValueChange={setAutoAssign} />
      </View>

      {candidates.map((technician, index) => (
        <TechnicianCard
          key={technician.technicianId}
          technician={technician}
          recommended={index === 0}
          selected={technician.technicianId === selectedId}
          onSelect={() => setSelectedId(technician.technicianId)}
        />
      ))}

      <TouchableOpacity style={styles.ctaButton} onPress={handleConfirm} disabled={loading || !selected}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Confirmar y solicitar técnico</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function TechnicianCard({
  technician,
  recommended,
  selected,
  onSelect,
}: {
  technician: Candidate;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  return (
    <TouchableOpacity style={[styles.card, selected && styles.cardSelected]} onPress={onSelect}>
      {recommended ? <Text style={styles.recommendedTag}>RECOMENDADO ARREGLAPUES</Text> : null}
      <Text style={styles.name}>{technician.name}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.rating}>★ {technician.rating.toFixed(2)}</Text>
        <Text style={styles.distance}>{technician.distanceKm} km</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  toggleLabel: { color: colors.textPrimary, fontWeight: "600" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  cardSelected: { borderColor: colors.accent, borderWidth: 2 },
  recommendedTag: { color: colors.accent, fontWeight: "700", fontSize: 11, marginBottom: 4 },
  name: { fontWeight: "700", color: colors.textPrimary, fontSize: 15 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rating: { color: colors.textPrimary, fontSize: 12 },
  distance: { color: colors.textSecondary, fontSize: 12 },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
