import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { PAISA_SUGGESTIONS } from "../data/paisaSuggestions";

interface Props {
  onSelect: (description: string) => void;
  style?: object;
}

// "Don Repuesto": mascota flotante con tono bien paisa, para que describir
// el daño se sienta cercano en vez de llenar un formulario frío.
export function PaisaBot({ onSelect, style }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  function handlePick(description: string) {
    setOpen(false);
    onSelect(description);
  }

  return (
    <>
      <Animated.View style={[styles.floatingWrapper, style, { transform: [{ translateY }] }]}>
        <TouchableOpacity style={styles.bubble} onPress={() => setOpen(true)} activeOpacity={0.85}>
          <Text style={styles.bubbleText}>¿Qué necesita, mijo?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botButton} onPress={() => setOpen(true)} activeOpacity={0.85}>
          <View style={styles.hatBrim} />
          <View style={styles.hatCrown} />
          <View style={styles.hatBand} />
          <Text style={styles.botEmoji}>🤖</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalAvatar}>
                  <View style={[styles.hatBrim, styles.hatBrimSmall]} />
                  <View style={[styles.hatCrown, styles.hatCrownSmall]} />
                  <Text style={styles.modalBotEmoji}>🤖</Text>
                </View>
                <View>
                  <Text style={styles.modalTitle}>Don Repuesto</Text>
                  <Text style={styles.modalSubtitle}>"¿Qué fue lo que se dañó, parcero?"</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.listLabel}>Dígame cuál fue el problema, mijo:</Text>
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {PAISA_SUGGESTIONS.map((item) => (
                <TouchableOpacity key={item.id} style={styles.suggestionRow} onPress={() => handlePick(item.description)}>
                  <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                  <Text style={styles.suggestionText}>{item.text}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const HAT_COLOR = "#C98A4B";
const HAT_BAND_COLOR = "#7A4A24";

const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    right: 14,
    alignItems: "flex-end",
    gap: 6,
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    maxWidth: 160,
  },
  bubbleText: { color: colors.textPrimary, fontSize: 11, fontWeight: "700", textAlign: "center" },
  botButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  botEmoji: { fontSize: 26, marginTop: 6 },
  hatBrim: {
    position: "absolute",
    top: -6,
    width: 46,
    height: 14,
    borderRadius: 23,
    backgroundColor: HAT_COLOR,
    borderWidth: 1,
    borderColor: HAT_BAND_COLOR,
  },
  hatCrown: {
    position: "absolute",
    top: -14,
    width: 24,
    height: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: HAT_COLOR,
  },
  hatBand: {
    position: "absolute",
    top: -2,
    width: 24,
    height: 4,
    backgroundColor: HAT_BAND_COLOR,
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "75%",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  hatBrimSmall: { top: -5, width: 40, height: 12 },
  hatCrownSmall: { top: -11, width: 20, height: 13 },
  modalBotEmoji: { fontSize: 22, marginTop: 5 },
  modalTitle: { fontWeight: "800", fontSize: 16, color: colors.textPrimary },
  modalSubtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 2, fontStyle: "italic" },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  listLabel: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, marginBottom: 10, textTransform: "uppercase" },
  list: { marginBottom: 4 },
  suggestionRow: {
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
  suggestionEmoji: { fontSize: 18 },
  suggestionText: { flex: 1, color: colors.textPrimary, fontSize: 13, fontWeight: "600" },
});
