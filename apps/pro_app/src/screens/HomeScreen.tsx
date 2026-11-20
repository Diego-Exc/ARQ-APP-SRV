import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi, TechnicianProfile } from "../api/client";
import { formatCOP } from "../utils/format";
import { earningsSummary, notifications } from "../data/mock";
import type { MainTabParamList } from "../navigation/AppNavigator";

type Props = BottomTabScreenProps<MainTabParamList, "HomeTab">;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    proApi.getMyProfile().then((p) => setProfile(p ?? null));
  }, []);

  async function toggleOnline(value: boolean) {
    setProfile((prev) => (prev ? { ...prev, online: value } : prev));
    await proApi.setAvailability(value);
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
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>ArreglaPues Pro</Text>
          <Text style={styles.greeting}>Hola, {profile.name.split(" ")[0]}</Text>
        </View>
        <TouchableOpacity style={styles.bellButton} onPress={() => navigation.getParent()?.navigate("Notifications" as never)}>
          <Ionicons name="notifications" size={20} color={colors.primary} />
          {unread > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={[styles.statusDot, profile.online && styles.statusDotOn]} />
          <Text style={styles.statusLabel}>{profile.online ? "Estás disponible" : "No disponible"}</Text>
        </View>
        <Switch value={profile.online} onValueChange={toggleOnline} />
      </View>

      <View style={styles.statsRow}>
        <StatCard icon="cash" label="Hoy" value={formatCOP(earningsSummary.today)} />
        <StatCard icon="star" label="Calificación" value={profile.rating.toFixed(2)} />
        <StatCard icon="checkmark-done" label="Servicios" value={`${profile.reviews}`} />
      </View>

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.menu}>
        <MenuCard
          icon="briefcase"
          label="Solicitudes entrantes"
          description="Ver y aceptar servicios cerca de ti"
          onPress={() => navigation.navigate("RequestsTab")}
        />
        <MenuCard
          icon="cash"
          label="Mis ganancias"
          description="Historial de pagos y retiros"
          onPress={() => navigation.navigate("EarningsTab")}
        />
        <MenuCard
          icon="person-circle"
          label="Mi perfil"
          description="Calificación, documentos y horario"
          onPress={() => navigation.navigate("ProfileTab")}
        />
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuCard({
  icon,
  label,
  description,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  brand: { color: colors.accent, fontWeight: "700", fontSize: 14 },
  greeting: { fontSize: 22, fontWeight: "700", color: colors.textPrimary, marginTop: 2 },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "700" },
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.textSecondary },
  statusDotOn: { backgroundColor: colors.success },
  statusLabel: { color: colors.textPrimary, fontWeight: "700", fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontWeight: "800", color: colors.textPrimary, fontSize: 14 },
  statLabel: { color: colors.textSecondary, fontSize: 10 },
  sectionTitle: { fontWeight: "700", color: colors.textPrimary, marginBottom: 10 },
  menu: { gap: 12 },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { fontWeight: "700", color: colors.textPrimary, fontSize: 15 },
  menuDescription: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
