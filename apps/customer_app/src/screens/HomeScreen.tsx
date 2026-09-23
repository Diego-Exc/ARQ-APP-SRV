import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { categories } from "../data/mock";
import { formatCOP } from "../utils/format";

type Props = {
  navigation: { navigate: (screen: string) => void };
};

export function HomeScreen({ navigation }: Props): JSX.Element {
  const [damageDescription, setDamageDescription] = useState("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Hogar+ Express</Text>
      <Text style={styles.title}>Soluciones al instante</Text>

      <View style={styles.searchCard}>
        <Text style={styles.searchLabel}>¿Qué se dañó en tu casa?</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Ej. Fuga debajo del lavaplatos"
          placeholderTextColor={colors.textSecondary}
          value={damageDescription}
          onChangeText={setDamageDescription}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate("Diagnosis")}
        >
          <Text style={styles.searchButtonText}>Diagnosticar con IA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.expressBanner}>
        <Text style={styles.expressTitle}>Servicio Express 24/7</Text>
        <Text style={styles.expressSubtitle}>Técnico en tu puerta en menos de 35 min</Text>
      </View>

      <Text style={styles.sectionTitle}>Servicios Profesionales</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryPrice}>Desde {formatCOP(category.priceFrom)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  brand: { color: colors.accent, fontWeight: "600", marginBottom: 4 },
  title: { fontSize: 24, fontWeight: "700", color: colors.primary, marginBottom: 16 },
  searchCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  searchLabel: { color: "#FFFFFF", fontWeight: "600", marginBottom: 8 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchButtonText: { color: "#FFFFFF", fontWeight: "700" },
  expressBanner: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  expressTitle: { color: colors.accent, fontWeight: "700" },
  expressSubtitle: { color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    width: "47%",
  },
  categoryName: { fontWeight: "600", color: colors.textPrimary },
  categoryPrice: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
});
