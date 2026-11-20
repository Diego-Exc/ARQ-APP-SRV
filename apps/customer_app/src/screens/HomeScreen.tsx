import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { categories, technicians } from "../data/mock";
import { clientNotifications } from "../data/mock";
import { formatCOP } from "../utils/format";
import { api } from "../api/client";
import { CLIENT_LOCATION } from "../data/location";
import type { RootStackParamList } from "../navigation/AppNavigator";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wrench: "water",
  bolt: "flash",
  lock: "key",
  appliance: "hardware-chip",
  roller: "color-palette",
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  const [damageDescription, setDamageDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const unread = clientNotifications.filter((n) => !n.read).length;
  const firstName = (api.currentUserName ?? "Cliente").split(" ")[0];

  async function handleDiagnose(description: string = damageDescription) {
    setErrorMessage(null);
    if (!description.trim()) {
      setErrorMessage("Cuéntanos qué pasó para poder ayudarte.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.createRequest(description, CLIENT_LOCATION);
      navigation.navigate("Diagnosis", { ...result, description });
    } catch (error) {
      setErrorMessage((error as Error).message || "No se pudo diagnosticar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryPress(categoryName: string) {
    const description = `Necesito un servicio de ${categoryName.toLowerCase()}`;
    setDamageDescription(description);
    handleDiagnose(description);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>ArreglaPues</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={13} color={colors.textSecondary} />
            <Text style={styles.locationText}>El Poblado, Medellín</Text>
          </View>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications" size={18} color={colors.primary} />
            {unread > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate("Account")}>
            <Ionicons name="person" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
      <Text style={styles.title}>¿Qué necesitas arreglar hoy?</Text>

      <View style={styles.searchCard}>
        <View style={styles.searchLabelRow}>
          <Ionicons name="sparkles" size={14} color="#FFFFFF" />
          <Text style={styles.searchLabel}>Diagnóstico con IA</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Ej. Fuga debajo del lavaplatos"
          placeholderTextColor={colors.textSecondary}
          value={damageDescription}
          onChangeText={setDamageDescription}
          multiline
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleDiagnose()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.searchButtonText}>Diagnosticar con IA</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.expressBanner}>
        <View style={styles.expressIcon}>
          <Ionicons name="flash" size={20} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.expressTitle}>Servicio Express 24/7</Text>
          <Text style={styles.expressSubtitle}>Técnico en tu puerta en menos de 35 min</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.accent} />
      </View>

      <Text style={styles.sectionTitle}>Servicios Profesionales</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            activeOpacity={0.7}
            onPress={() => handleCategoryPress(category.name)}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name={CATEGORY_ICONS[category.icon] ?? "build"} size={20} color={colors.accent} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryPrice}>Desde {formatCOP(category.priceFrom)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Técnicos destacados cerca de ti</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.technicianRow}>
        {technicians.map((tech) => (
          <TouchableOpacity
            key={tech.id}
            style={styles.technicianCard}
            activeOpacity={0.7}
            onPress={() => handleCategoryPress(tech.trade)}
          >
            {tech.recommended ? (
              <View style={styles.recommendedPill}>
                <Ionicons name="ribbon" size={10} color="#FFFFFF" />
                <Text style={styles.recommendedPillText}>TOP</Text>
              </View>
            ) : null}
            <View style={styles.technicianAvatar}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
            <Text style={styles.technicianName} numberOfLines={1}>
              {tech.name}
            </Text>
            <Text style={styles.technicianTrade} numberOfLines={2}>
              {tech.trade}
            </Text>
            <View style={styles.technicianMeta}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.technicianRating}>{tech.rating.toFixed(2)}</Text>
              <Text style={styles.technicianDistance}>· {tech.distanceKm} km</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.trustRow}>
        <TrustItem icon="shield-checkmark" label="Pagos seguros" />
        <TrustItem icon="ribbon" label="Técnicos verificados" />
        <TrustItem icon="refresh" label="Garantía 30 días" />
      </View>
    </ScrollView>
  );
}

function TrustItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }): React.JSX.Element {
  return (
    <View style={styles.trustItem}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.trustLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  brand: { color: colors.accent, fontWeight: "700", fontSize: 14 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  locationText: { color: colors.textSecondary, fontSize: 11 },
  topBarActions: { flexDirection: "row", gap: 10 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#FFFFFF", fontSize: 8, fontWeight: "700" },
  greeting: { fontSize: 15, fontWeight: "600", color: colors.textSecondary },
  title: { fontSize: 22, fontWeight: "800", color: colors.primary, marginBottom: 16, marginTop: 2 },
  searchCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  searchLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  searchLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    minHeight: 44,
    color: colors.textPrimary,
  },
  searchButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: { color: "#FFFFFF", fontWeight: "700" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.danger,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  errorText: { color: "#FFFFFF", fontSize: 12, flex: 1 },
  expressBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },
  expressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  expressTitle: { color: colors.accent, fontWeight: "700" },
  expressSubtitle: { color: colors.textSecondary, marginTop: 2, fontSize: 12 },
  sectionHeaderRow: { marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    width: "47%",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryName: { fontWeight: "600", color: colors.textPrimary },
  categoryPrice: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
  technicianRow: { gap: 12, paddingBottom: 4, paddingRight: 8 },
  technicianCard: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  recommendedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  recommendedPillText: { color: "#FFFFFF", fontSize: 9, fontWeight: "800" },
  technicianAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  technicianName: { fontWeight: "700", color: colors.textPrimary, fontSize: 13 },
  technicianTrade: { color: colors.textSecondary, fontSize: 10, marginTop: 2, minHeight: 26 },
  technicianMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 6 },
  technicianRating: { fontSize: 11, fontWeight: "700", color: colors.textPrimary },
  technicianDistance: { fontSize: 11, color: colors.textSecondary },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  trustItem: { alignItems: "center", gap: 6, flex: 1 },
  trustLabel: { color: colors.textSecondary, fontSize: 9, textAlign: "center" },
});
