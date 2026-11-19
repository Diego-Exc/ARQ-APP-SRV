import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { proApi, ServiceRequestView, TechnicianOffer } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "IncomingRequests">;

interface OfferRow extends TechnicianOffer {
  description?: string;
  urgency?: string;
}

export function IncomingRequestsScreen({ navigation }: Props): JSX.Element {
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
      navigation.replace("ServiceDetail", { requestId });
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
        <Text style={styles.empty}>No tienes solicitudes ofrecidas en este momento.</Text>
      ) : (
        offers.map((offer) => (
          <View key={offer.requestId} style={styles.card}>
            <Text style={styles.urgency}>{offer.urgency ?? "—"}</Text>
            <Text style={styles.description}>{offer.description ?? "Solicitud de servicio"}</Text>
            <Text style={styles.meta}>
              {offer.distanceKm.toFixed(1)} km · score {offer.score.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(offer.requestId)}
              disabled={acceptingId === offer.requestId}
            >
              {acceptingId === offer.requestId ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.acceptText}>Aceptar</Text>
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
  empty: { color: colors.textSecondary, textAlign: "center", marginTop: 40 },
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
  meta: { color: colors.textSecondary, marginTop: 6, fontSize: 12 },
  acceptButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  acceptText: { color: "#FFFFFF", fontWeight: "700" },
});
