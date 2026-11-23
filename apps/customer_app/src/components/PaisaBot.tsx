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
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { PAISA_SUGGESTIONS } from "../data/paisaSuggestions";

interface Props {
  onSelect: (description: string) => void;
  style?: object;
}

const GREETINGS = [
  "¿Qué necesita, mijo?",
  "¿En qué lo ayudo, papito?",
  "Cuénteme qué se dañó, parcero",
  "¿Qué fue lo que se le rompió, pues?",
  "Hágale, dígame qué pasó",
  "¿Qué se le dañó hoy, caballero?",
  "Pregúnteme, que para eso estoy, ome",
  "Dele, cuénteme ese problemita",
];

function randomGreeting(exclude?: string): string {
  const options = exclude ? GREETINGS.filter((g) => g !== exclude) : GREETINGS;
  return options[Math.floor(Math.random() * options.length)];
}

// Robot dibujado en vectores (no emoji, no placeholder): sombrero
// antioqueño, bigote y cara metálica. "Don Repuesto", la mascota del
// diagnóstico asistido.
function RobotIllustration({ size = 56 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Sombrero */}
      <Ellipse cx="50" cy="30" rx="34" ry="9" fill="#C98A4B" stroke="#7A4A24" strokeWidth="1.5" />
      <Path d="M30 30 Q30 12 50 12 Q70 12 70 30 Z" fill="#D89A5A" stroke="#7A4A24" strokeWidth="1.5" />
      <Rect x="31" y="27" width="38" height="5" rx="2" fill="#7A4A24" />

      {/* Cabeza */}
      <Rect x="26" y="34" width="48" height="40" rx="12" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
      <Rect x="30" y="38" width="40" height="30" rx="8" fill="#E2E8F0" />

      {/* Antena */}
      <Rect x="48" y="4" width="4" height="10" fill="#64748B" />
      <Circle cx="50" cy="4" r="3.5" fill={colors.accent} />

      {/* Ojos */}
      <Circle cx="40" cy="52" r="6" fill="#1E3A5F" />
      <Circle cx="60" cy="52" r="6" fill="#1E3A5F" />
      <Circle cx="42" cy="50" r="1.6" fill="#FFFFFF" />
      <Circle cx="62" cy="50" r="1.6" fill="#FFFFFF" />

      {/* Bigote */}
      <Path
        d="M32 63 Q40 58 50 63 Q60 58 68 63 Q62 68 50 65 Q38 68 32 63 Z"
        fill="#3F3F46"
      />

      {/* Orejas / tornillos */}
      <Circle cx="24" cy="54" r="4" fill="#94A3B8" />
      <Circle cx="76" cy="54" r="4" fill="#94A3B8" />
    </Svg>
  );
}

export function PaisaBot({ onSelect, style }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greeting, setGreeting] = useState(() => randomGreeting());
  const bounce = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // useNativeDriver:true no anima bien en react-native-web (se queda
    // pegado/estatico en el navegador) - en web y nativo se usa false.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    // El saludo aparece cada cierto tiempo con una frase distinta cada vez
    // (no un texto fijo pegado todo el rato), para que se sienta mas natural.
    // El apagado se controla con sus propios setTimeout (no con el callback
    // de Animated.start): si la animacion no corre bien, igual desaparece.
    function cycle(delay: number) {
      timer = setTimeout(() => {
        if (cancelled || open) {
          cycle(4000);
          return;
        }
        setGreeting((prev) => randomGreeting(prev));
        setShowGreeting(true);
        greetingOpacity.setValue(0);
        Animated.timing(greetingOpacity, { toValue: 1, duration: 400, useNativeDriver: false }).start();

        timer = setTimeout(() => {
          if (cancelled) return;
          Animated.timing(greetingOpacity, { toValue: 0, duration: 500, useNativeDriver: false }).start();
          timer = setTimeout(() => {
            if (cancelled) return;
            setShowGreeting(false);
            cycle(14000);
          }, 500);
        }, 3800);
      }, delay);
    }
    cycle(900);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [greetingOpacity, open]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  function handlePick(description: string) {
    setOpen(false);
    onSelect(description);
  }

  return (
    <>
      <View style={[styles.floatingWrapper, style]}>
        {showGreeting ? (
          <Animated.View style={[styles.bubble, { opacity: greetingOpacity }]}>
            <Text style={styles.bubbleText}>{greeting}</Text>
          </Animated.View>
        ) : null}
        <Animated.View style={{ transform: [{ translateY }] }}>
          <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.85} style={styles.botTouchable}>
            <RobotIllustration />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <RobotIllustration size={44} />
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

const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    right: 14,
    alignItems: "flex-end",
    gap: 6,
    zIndex: 50,
    elevation: 12,
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
  botTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
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
