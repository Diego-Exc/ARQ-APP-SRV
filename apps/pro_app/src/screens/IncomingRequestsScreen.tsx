import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi, ServiceRequestView, TechnicianOffer } from "../api/client";
import type { MainTabParamList, RootStackParamList } from "../navigation/AppNavigator";
import type { NavigationProp } from "@react-navigation/native";

type Props = BottomTabScreenProps<MainTabParamList, "RequestsTab">;

interface OfferRow extends TechnicianOffer {
  description?: string;
  urgency?: string;
}

export function IncomingRequestsScreen({ navigation }: Props): React.JSX.Element {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const list = await proApi.listOffers();
    const enriched: OfferRow[] = await Promise.all(
      list.map(async (offer) => {
        try {
          const detail: ServiceRequestView = await proApi.getRequest(offer.requestId);
          return { ...offer, description: detail.description, urgency: detail.urgency };
        } catch {
          return offer;
        }
      }),
    );
    setOffers(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Las ofertas tienen una ventana corta (~45 s, decisión de cierre del
    // MVP): se refrescan periódicamente en vez de requerir recarga manual.
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  async function handleAccept(requestId: string) {
    setAcceptingId(requestId);
    try {
      await proApi.acceptService(requestId);
      navigation.getParent<NavigationProp<RootStackParamList>>()?.navigate("ServiceDetail", { requestId });
    } catch (error) {
      Alert.alert("No se pudo aceptar", (error as Error).message);
    } finally {
      setAcceptingId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}
    >
      <Text style={styles.header}>Solicitudes entrantes</Text>

      {offers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="moon" size={28} color={colors.textSecondary} />
          <Text style={styles.empty}>No tienes solicitudes ofrecidas en este momento.</Text>
        </View>
      ) : (
        offers.map((offer) => (
          <View key={offer.requestId} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="alert-circle" size={14} color={colors.danger} />
              <Text style={styles.urgency}>{offer.urgency ?? "—"}</Text>
            </View>
            <Text style={styles.description}>{offer.description ?? "Solicitud de servicio"}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="location" size={14} color={colors.textSecondary} />
              <Text style={styles.meta}>{offer.distanceKm.toFixed(1)} km · score {offer.score.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(offer.requestId)}
              disabled={acceptingId === offer.requestId}
            >
              {acceptingId === offer.requestId ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.acceptText}>Aceptar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  emptyState: { alignItems: "center", gap: 10, marginTop: 60 },
  empty: { color: colors.textSecondary, textAlign: "center" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  urgency: { color: colors.danger, fontWeight: "700", fontSize: 12 },
  description: { color: colors.textPrimary, marginTop: 4, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  meta: { color: colors.textSecondary, fontSize: 12 },
  acceptButton: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  acceptText: { color: "#FFFFFF", fontWeight: "700" },
});
