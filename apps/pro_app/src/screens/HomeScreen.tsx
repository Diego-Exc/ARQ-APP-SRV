import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { proApi, TechnicianProfile } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props): JSX.Element {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);

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
    <View style={styles.container}>
      <Text style={styles.brand}>ArreglaPues Pro</Text>
      <View style={styles.profileCard}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>★ {profile.rating.toFixed(2)} · {profile.reviews} servicios</Text>
        <Text style={styles.meta}>Oficios: {profile.trades.join(", ")}</Text>
        {profile.verified ? <Text style={styles.verified}>Perfil verificado</Text> : <Text style={styles.pending}>Pendiente de aprobación</Text>}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Disponible para recibir solicitudes</Text>
          <Switch value={profile.online} onValueChange={toggleOnline} />
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("IncomingRequests")}>
        <Text style={styles.ctaText}>Ver solicitudes entrantes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  brand: { color: colors.accent, fontWeight: "700", fontSize: 18, marginBottom: 16 },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  meta: { color: colors.textSecondary, marginTop: 4 },
  verified: { color: colors.success, fontWeight: "600", marginTop: 8 },
  pending: { color: colors.danger, fontWeight: "600", marginTop: 8 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleLabel: { color: colors.textPrimary, fontWeight: "600", flex: 1, marginRight: 8 },
  ctaButton: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#FFFFFF", fontWeight: "700" },
});
