import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { categories, clientNotifications, TECHNICIAN_DETAILS } from "../data/mock";
import { formatCOP } from "../utils/format";
import { api, Candidate, TechnicianProfile } from "../api/client";
import { CLIENT_LOCATION, regionForPoints } from "../data/location";
import { ServiceMap, MapMarker } from "../components/ServiceMap";
import { PaisaBot } from "../components/PaisaBot";
import type { MainTabParamList, RootStackParamList } from "../navigation/AppNavigator";

// Altura aproximada de la barra de pestañas (react-navigation/bottom-tabs,
// sin safe-area inset) que este Home nunca debe tapar con sus paneles.
const TAB_BAR_CLEARANCE = 56;

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wrench: "water",
  bolt: "flash",
  lock: "key",
  appliance: "hardware-chip",
  roller: "color-palette",
};

type Props = BottomTabScreenProps<MainTabParamList, "HomeTab">;
type Phase = "browse" | "matching" | "results";

interface DiagnosisSummary {
  requestId: string;
  tradeId: string | null;
  tradeName: string | null;
  urgency: string;
  confidence: number;
}

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  // Tracking y Notifications viven en el Stack raiz, no dentro del
  // Tab.Navigator: hay que subir con getParent() para llegar a ellas.
  const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>();
  const [damageDescription, setDamageDescription] = useState("");
  const [phase, setPhase] = useState<Phase>("browse");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allTechnicians, setAllTechnicians] = useState<TechnicianProfile[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisSummary | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);

  const unread = clientNotifications.filter((n) => !n.read).length;
  const firstName = (api.currentUserName ?? "Cliente").split(" ")[0];

  useEffect(() => {
    api
      .listTechnicians()
      .then((list) => setAllTechnicians(list.filter((t) => t.online)))
      .catch(() => undefined);
  }, []);

  const byId = useMemo(() => new Map(allTechnicians.map((t) => [t.id, t])), [allTechnicians]);

  const markers: MapMarker[] = useMemo(() => {
    const clientMarker = { id: "client", lat: CLIENT_LOCATION.lat, lng: CLIENT_LOCATION.lng, icon: "home" as const, color: colors.primary };
    if (phase === "results") {
      const candidateMarkers = candidates
        .map((c) => {
          const tech = byId.get(c.technicianId);
          if (!tech) return null;
          return {
            id: c.technicianId,
            lat: tech.location.lat,
            lng: tech.location.lng,
            icon: "construct" as const,
            color: c.technicianId === selectedId ? colors.accent : colors.primary,
          };
        })
        .filter((m): m is NonNullable<typeof m> => m !== null);
      return [clientMarker, ...candidateMarkers];
    }
    return [
      clientMarker,
      ...allTechnicians.map((t) => ({ id: t.id, lat: t.location.lat, lng: t.location.lng, icon: "construct" as const, color: colors.textSecondary })),
    ];
  }, [phase, candidates, byId, allTechnicians, selectedId]);

  const region = useMemo(() => {
    const points = markers.map((m) => ({ lat: m.lat, lng: m.lng }));
    return regionForPoints(points.length > 0 ? points : [CLIENT_LOCATION]);
  }, [markers]);

  async function runDiagnosis(description: string) {
    setErrorMessage(null);
    if (!description.trim()) {
      setErrorMessage("Cuéntanos qué pasó para poder ayudarte.");
      return;
    }
    setPhase("matching");
    try {
      const result = await api.createRequest(description, CLIENT_LOCATION);
      setDiagnosis({
        requestId: result.requestId,
        tradeId: result.tradeId,
        tradeName: result.tradeName,
        urgency: result.urgency,
        confidence: result.confidence,
      });

      if (!result.tradeId) {
        setErrorMessage("No identificamos el oficio con certeza. Intenta describirlo con más detalle.");
        setPhase("browse");
        return;
      }

      const matched = await api.findCandidates(result.requestId, result.tradeId, CLIENT_LOCATION);
      setCandidates(matched.candidates);
      setSelectedId(matched.candidates[0]?.technicianId ?? null);
      setSheetCollapsed(false);
      setPhase("results");
    } catch (error) {
      setErrorMessage((error as Error).message || "No se pudo diagnosticar. Intenta de nuevo.");
      setPhase("browse");
    }
  }

  function handleCategoryPress(categoryName: string) {
    const description = `Necesito un servicio de ${categoryName.toLowerCase()}`;
    setDamageDescription(description);
    runDiagnosis(description);
  }

  function handleBackToBrowse() {
    setPhase("browse");
    setDiagnosis(null);
    setCandidates([]);
    setSelectedId(null);
    setDamageDescription("");
  }

  async function handleConfirm() {
    if (!diagnosis || !selectedId) return;
    const selected = candidates.find((c) => c.technicianId === selectedId);
    if (!selected) return;
    setConfirming(true);
    try {
      await api.acceptService(diagnosis.requestId, selected.technicianId);
      rootNavigation?.navigate("Tracking", {
        requestId: diagnosis.requestId,
        technicianId: selected.technicianId,
        technicianName: selected.name,
        distanceKm: selected.distanceKm,
      });
    } catch (error) {
      setErrorMessage((error as Error).message || "No se pudo confirmar el técnico.");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <View style={styles.container}>
      <ServiceMap markers={markers} region={region} style={styles.map} />

      <View style={styles.topBar}>
        <View style={styles.topBarCard}>
          <Text style={styles.brand}>ArreglaPues</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={13} color={colors.textSecondary} />
            <Text style={styles.locationText}>El Poblado, Medellín</Text>
          </View>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => rootNavigation?.navigate("Notifications")}>
            <Ionicons name="notifications" size={18} color={colors.primary} />
            {unread > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate("AccountTab")}>
            <Ionicons name="person" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {phase === "browse" ? (
        <PaisaBot style={styles.paisaBot} onSelect={(description) => runDiagnosis(description)} />
      ) : null}

      {phase !== "results" ? (
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
          <Text style={styles.title}>¿Qué necesitas arreglar hoy?</Text>

          <Text style={styles.quickLabel}>Selecciona directo lo que necesitas:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryChip}
                activeOpacity={0.7}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Ionicons name={CATEGORY_ICONS[category.icon] ?? "build"} size={16} color={colors.accent} />
                <Text style={styles.categoryChipText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.quickLabel}>O descríbelo con tus palabras:</Text>
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
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => runDiagnosis(damageDescription)}
              disabled={phase === "matching"}
            >
              {phase === "matching" ? (
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

          <Text style={styles.nearbyCount}>
            <Ionicons name="construct" size={12} color={colors.success} /> {allTechnicians.length} técnicos disponibles cerca de ti
          </Text>
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.sheet, styles.resultsSheet, sheetCollapsed && styles.resultsSheetCollapsed]}>
          <TouchableOpacity onPress={() => setSheetCollapsed((v) => !v)} style={styles.sheetHandleTouchable}>
            <View style={styles.sheetHandle} />
          </TouchableOpacity>
          <View style={styles.resultsHeader}>
            <TouchableOpacity onPress={handleBackToBrowse} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultsTitle}>{diagnosis?.tradeName ?? "Técnicos disponibles"}</Text>
              <Text style={styles.resultsSubtitle}>
                {candidates.length} profesionales · {Math.round((diagnosis?.confidence ?? 0) * 100)}% certeza · {diagnosis?.urgency}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSheetCollapsed((v) => !v)} style={styles.collapseButton}>
              <Ionicons name={sheetCollapsed ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!sheetCollapsed ? (
            <>
              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={14} color="#FFFFFF" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <ScrollView style={styles.candidateList} showsVerticalScrollIndicator={false}>
                {candidates.map((candidate, index) => {
                  const detail = TECHNICIAN_DETAILS[candidate.technicianId];
                  const verified = byId.get(candidate.technicianId)?.verified ?? false;
                  const selected = candidate.technicianId === selectedId;
                  return (
                    <TouchableOpacity
                      key={candidate.technicianId}
                      style={[styles.candidateCard, selected && styles.candidateCardSelected]}
                      onPress={() => setSelectedId(candidate.technicianId)}
                    >
                      <View style={styles.candidateTopRow}>
                        {index === 0 ? (
                          <View style={styles.recommendedRow}>
                            <Ionicons name="ribbon" size={12} color={colors.accent} />
                            <Text style={styles.recommendedText}>RECOMENDADO</Text>
                          </View>
                        ) : (
                          <View />
                        )}
                        {detail ? <Text style={styles.priceText}>Desde {formatCOP(detail.estimatedPrice)}</Text> : null}
                      </View>

                      <View style={styles.candidateRow}>
                        <View style={styles.candidateAvatar}>
                          <Ionicons name="person" size={22} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.nameRow}>
                            <Text style={styles.candidateName}>{candidate.name}</Text>
                            {verified ? <Ionicons name="checkmark-circle" size={14} color={colors.success} /> : null}
                          </View>
                          {detail ? <Text style={styles.candidateTitle}>{detail.title}</Text> : null}
                          <View style={styles.candidateMeta}>
                            <Ionicons name="star" size={12} color="#F59E0B" />
                            <Text style={styles.candidateMetaText}>{candidate.rating.toFixed(2)}</Text>
                            {detail ? <Text style={styles.candidateMetaText}>({detail.reviews})</Text> : null}
                            <Text style={styles.candidateMetaText}>· {candidate.distanceKm} km</Text>
                            {detail ? (
                              <Text style={styles.candidateMetaText}>· {detail.experienceYears} años exp.</Text>
                            ) : null}
                          </View>
                        </View>
                        <Ionicons
                          name={selected ? "radio-button-on" : "radio-button-off"}
                          size={20}
                          color={selected ? colors.accent : colors.textSecondary}
                        />
                      </View>

                      {selected && detail ? (
                        <View style={styles.candidateBioBox}>
                          <Ionicons name="ribbon-outline" size={13} color={colors.textSecondary} />
                          <Text style={styles.candidateBioText}>{detail.specialty} — {detail.bio}</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={confirming || !selectedId}>
                {confirming ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirmar y solicitar técnico</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { ...StyleSheet.absoluteFill },
  topBar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topBarCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  brand: { color: colors.accent, fontWeight: "700", fontSize: 13 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  locationText: { color: colors.textSecondary, fontSize: 11 },
  topBarActions: { flexDirection: "row", gap: 10 },
  paisaBot: { top: 110 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 2,
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
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    // La barra de pestañas vive fuera de este Tab (es un screen de
    // react-navigation/bottom-tabs con altura propia); se deja un margen
    // fijo para que el panel flotante nunca quede tapado por ella.
    bottom: TAB_BAR_CLEARANCE,
    maxHeight: "46%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  quickLabel: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, marginBottom: 8, marginTop: 4 },
  resultsSheet: { top: "42%", bottom: TAB_BAR_CLEARANCE, display: "flex", overflow: "hidden" },
  resultsSheetCollapsed: { top: "85%" },
  sheetHandleTouchable: { paddingVertical: 4 },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 12,
  },
  greeting: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
  title: { fontSize: 20, fontWeight: "800", color: colors.primary, marginBottom: 14, marginTop: 2 },
  searchCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
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
  categoryRow: { gap: 8, paddingBottom: 4 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipText: { color: colors.textPrimary, fontWeight: "600", fontSize: 12 },
  nearbyCount: { color: colors.textSecondary, fontSize: 12, marginTop: 12, textAlign: "center" },
  resultsHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsTitle: { fontSize: 16, fontWeight: "800", color: colors.primary },
  resultsSubtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  collapseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  candidateList: { flex: 1 },
  candidateCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  candidateCardSelected: { borderColor: colors.accent, borderWidth: 2 },
  candidateTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  recommendedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  recommendedText: { color: colors.accent, fontWeight: "800", fontSize: 10 },
  priceText: { color: colors.success, fontWeight: "800", fontSize: 12 },
  candidateRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  candidateAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  candidateName: { fontWeight: "700", color: colors.textPrimary, fontSize: 14 },
  candidateTitle: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  candidateMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3, flexWrap: "wrap" },
  candidateMetaText: { fontSize: 11, color: colors.textSecondary },
  candidateBioBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  candidateBioText: { flex: 1, fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  confirmButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  confirmButtonText: { color: "#FFFFFF", fontWeight: "700" },
});
