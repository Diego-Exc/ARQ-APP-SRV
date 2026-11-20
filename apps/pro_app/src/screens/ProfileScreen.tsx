import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi, TechnicianProfile } from "../api/client";
import { documents } from "../data/mock";
import type { MainTabParamList, RootStackParamList } from "../navigation/AppNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "ProfileTab">,
  NativeStackScreenProps<RootStackParamList>
>;

const DOC_STATUS: Record<"verified" | "pending", { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  verified: { icon: "checkmark-circle", color: colors.success, label: "Verificado" },
  pending: { icon: "time", color: colors.danger, label: "En revisión" },
};

export function ProfileScreen({ navigation }: Props): React.JSX.Element {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);

  useEffect(() => {
    proApi.getMyProfile().then((p) => setProfile(p ?? null));
  }, []);

  async function toggleOnline(value: boolean) {
    setProfile((prev) => (prev ? { ...prev, online: value } : prev));
    await proApi.setAvailability(value);
  }

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir de tu cuenta de técnico?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          proApi.logout();
          navigation.getParent()?.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  if (!profile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={36} color={colors.accent} />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.ratingText}>{profile.rating.toFixed(2)}</Text>
          <Text style={styles.reviewsText}>· {profile.reviews} servicios realizados</Text>
        </View>

        {profile.verified ? (
          <View style={[styles.badge, styles.badgeVerified]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.badgeText, { color: colors.success }]}>Perfil verificado</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.badgePending]}>
            <Ionicons name="time" size={14} color={colors.danger} />
            <Text style={[styles.badgeText, { color: colors.danger }]}>Pendiente de aprobación</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Oficios</Text>
        <View style={styles.tradeRow}>
          {profile.trades.map((trade) => (
            <View key={trade} style={styles.tradeChip}>
              <Text style={styles.tradeChipText}>{trade}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="radio-button-on" size={18} color={profile.online ? colors.success : colors.textSecondary} />
            <Text style={styles.toggleLabel}>Disponible para recibir solicitudes</Text>
          </View>
          <Switch value={profile.online} onValueChange={toggleOnline} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documentos</Text>
        {documents.map((doc) => {
          const status = DOC_STATUS[doc.status];
          return (
            <View key={doc.id} style={styles.docRow}>
              <Ionicons name="document-text-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.docLabel}>{doc.label}</Text>
              <View style={styles.docStatus}>
                <Ionicons name={status.icon} size={14} color={status.color} />
                <Text style={[styles.docStatusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <MenuRow icon="calendar-outline" label="Mi horario" onPress={() => navigation.navigate("Schedule")} />
        <MenuRow icon="help-circle-outline" label="Ayuda y soporte" onPress={() => navigation.navigate("Support")} />
        <MenuRow icon="log-out-outline" label="Cerrar sesión" onPress={handleLogout} danger />
      </View>
    </ScrollView>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} />
      <Text style={[styles.menuRowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: 12 },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  ratingText: { fontWeight: "700", color: colors.textPrimary },
  reviewsText: { color: colors.textSecondary },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  badgeVerified: { backgroundColor: "#ECFDF5" },
  badgePending: { backgroundColor: "#FEF2F2" },
  badgeText: { fontWeight: "600", fontSize: 12 },
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: colors.textSecondary, marginBottom: 10, textTransform: "uppercase" },
  tradeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tradeChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tradeChipText: { color: colors.textPrimary, fontWeight: "600", fontSize: 12 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  toggleLabel: { color: colors.textPrimary, fontWeight: "600" },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  docLabel: { flex: 1, color: colors.textPrimary, fontWeight: "600", fontSize: 12 },
  docStatus: { flexDirection: "row", alignItems: "center", gap: 4 },
  docStatusText: { fontSize: 11, fontWeight: "700" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  menuRowLabel: { flex: 1, color: colors.textPrimary, fontWeight: "600", fontSize: 13 },
});
