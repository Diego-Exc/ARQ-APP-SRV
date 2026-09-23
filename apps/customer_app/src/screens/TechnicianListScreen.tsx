import React, { useState } from "react";
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { technicians, Technician } from "../data/mock";
import { formatCOP } from "../utils/format";

type Props = {
  navigation: { navigate: (screen: string) => void };
};

export function TechnicianListScreen({ navigation }: Props): JSX.Element {
  const [autoAssign, setAutoAssign] = useState(true);
  const [selectedId, setSelectedId] = useState<string>(technicians[0].id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Técnicos en tu zona</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Asignación Inteligente Rápida</Text>
        <Switch value={autoAssign} onValueChange={setAutoAssign} />
      </View>

      {technicians.map((technician) => (
        <TechnicianCard
          key={technician.id}
          technician={technician}
          selected={technician.id === selectedId}
          onSelect={() => setSelectedId(technician.id)}
        />
      ))}

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate("Tracking")}
      >
        <Text style={styles.ctaText}>Confirmar y solicitar técnico</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function TechnicianCard({
  technician,
  selected,
  onSelect,
}: {
  technician: Technician;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
    >
      {technician.recommended ? (
        <Text style={styles.recommendedTag}>RECOMENDADO HOGAR+</Text>
      ) : null}
      <Text style={styles.name}>{technician.name}</Text>
      <Text style={styles.trade}>{technician.trade}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.rating}>★ {technician.rating.toFixed(2)} · {technician.reviews} servicios</Text>
        <Text style={styles.distance}>
          {technician.distanceKm} km · Llega en ~{technician.etaMinutes} min
        </Text>
      </View>
      <Text style={styles.price}>{formatCOP(technician.price)}</Text>
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
  trade: { color: colors.textSecondary, marginTop: 2, fontSize: 12 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rating: { color: colors.textPrimary, fontSize: 12 },
  distance: { color: colors.textSecondary, fontSize: 12 },
  price: { color: colors.primary, fontWeight: "700", marginTop: 8 },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
