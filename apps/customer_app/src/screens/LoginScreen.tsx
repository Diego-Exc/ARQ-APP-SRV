import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const CATEGORY_BAR = [
  { icon: "flash" as const, label: "Electricidad" },
  { icon: "water" as const, label: "Plomería" },
  { icon: "hammer" as const, label: "Reparaciones\nen general" },
  { icon: "color-palette" as const, label: "Pintura y\nacabados" },
];

function soon(label: string) {
  Alert.alert(label, "Próximamente disponible.");
}

export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      if (mode === "login") {
        await api.login(email, password);
      } else {
        if (!name.trim()) {
          Alert.alert("Falta tu nombre", "Escribe tu nombre para crear la cuenta.");
          setLoading(false);
          return;
        }
        await api.register(name, email, password);
      }
      navigation.replace("Home");
    } catch (error) {
      Alert.alert(mode === "login" ? "No se pudo iniciar sesión" : "No se pudo crear la cuenta", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={["#DCE9F7", "#F3F6FB"]} style={StyleSheet.absoluteFill} />
          <View style={styles.cornerNavy} />
          <View style={styles.cornerOrange} />

          <View style={styles.logoBlock}>
            <View style={styles.logoMark}>
              <Ionicons name="home" size={64} color={colors.primary} />
              <View style={styles.logoWrenchBadge}>
                <Ionicons name="build" size={26} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.wordmark}>
              <Text style={{ color: colors.primary }}>Arregla</Text>
              <Text style={{ color: colors.accent }}>Pues</Text>
            </Text>
            <Text style={styles.tagline}>¡Tu hogar en buenas manos!</Text>
          </View>

          <Svg
            width="100%"
            height={70}
            viewBox="0 0 1440 220"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- los tipos de react-native-svg difieren entre web y nativo para `style`
            style={styles.wave as any}
            preserveAspectRatio="none"
          >
            <Path
              fill={colors.surface}
              d="M0,140L80,151.3C160,163,320,185,480,176C640,167,800,128,960,117.3C1120,107,1280,128,1360,138.3L1440,149L1440,220L0,220Z"
            />
          </Svg>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {mode === "register" ? (
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <TextInput
                style={styles.inputText}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
          ) : null}

          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.inputText}
              autoCapitalize="none"
              placeholder="Correo electrónico"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.inputText}
              placeholder="Contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember((v) => !v)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
              </View>
              <Text style={styles.rememberLabel}>Recordar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => soon("Recuperar contraseña")}>
              <Text style={styles.forgotLabel}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={() => soon("Continuar con Google")} activeOpacity={0.85}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerRow}
            onPress={() => setMode((m) => (m === "login" ? "register" : "login"))}
          >
            <Ionicons name="hardware-chip-outline" size={28} color={colors.primary} />
            <Text style={styles.registerText}>
              {mode === "login" ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
              <Text style={styles.registerLink}>
                {mode === "login" ? "Regístrate aquí ›" : "Inicia sesión ›"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Franja de oficios */}
        <View style={styles.categoryBar}>
          {CATEGORY_BAR.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 ? <View style={styles.categoryDivider} /> : null}
              <View style={styles.categoryItem}>
                <Ionicons name={item.icon} size={20} color="#FFFFFF" />
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { flexGrow: 1 },
  hero: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cornerNavy: {
    position: "absolute",
    top: -70,
    left: -90,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary,
  },
  cornerOrange: {
    position: "absolute",
    top: -60,
    right: -70,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
  },
  wave: { position: "absolute", bottom: 0, left: 0 },
  logoBlock: { alignItems: "center", marginTop: 10 },
  logoMark: { alignItems: "center", justifyContent: "center" },
  logoWrenchBadge: {
    position: "absolute",
    bottom: -4,
    right: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#F3F6FB",
  },
  wordmark: { fontSize: 32, fontWeight: "800", marginTop: 10 },
  tagline: { color: colors.accent, fontWeight: "700", fontStyle: "italic", marginTop: 2, fontSize: 13 },
  card: { backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 12,
  },
  inputText: { flex: 1, paddingVertical: 13, color: colors.textPrimary },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 6 },
  rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: colors.accent },
  rememberLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: "600" },
  forgotLabel: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  primaryButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { color: colors.textSecondary, fontSize: 12 },
  googleButton: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleButtonText: { color: colors.textPrimary, fontWeight: "700", fontSize: 14 },
  registerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  registerText: { color: colors.textPrimary, fontSize: 13, flex: 1 },
  registerLink: { color: colors.accent, fontWeight: "700" },
  categoryBar: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  categoryItem: { flex: 1, alignItems: "center", gap: 6, paddingHorizontal: 4 },
  categoryDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  categoryLabel: { color: "#FFFFFF", fontSize: 10, textAlign: "center", fontWeight: "600" },
});
