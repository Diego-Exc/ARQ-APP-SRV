import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { proApi } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// Las credenciales demo viven en variables de entorno del backend (ver
// backend/src/bootstrap/migrate.ts), nunca en el código fuente público.
export function LoginScreen({ navigation }: Props): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await proApi.login(email, password);
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("No se pudo iniciar sesión", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#0F172A", colors.primary]} style={styles.gradient}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.logoRing}>
              <View style={styles.logoCircle}>
                <Ionicons name="construct" size={34} color={colors.accent} />
              </View>
            </View>
            <Text style={styles.brand}>ArreglaPues Pro</Text>
            <Text style={styles.tagline}>Portal de técnicos verificados</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                autoCapitalize="none"
                placeholder="Correo"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                placeholder="Contraseña"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Ingresar</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

          </View>

          <View style={styles.trustRow}>
            <TrustItem icon="briefcase-outline" label="Más solicitudes" />
            <TrustItem icon="trending-up-outline" label="Más ingresos" />
            <TrustItem icon="shield-checkmark-outline" label="Pagos garantizados" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function TrustItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }): React.JSX.Element {
  return (
    <View style={styles.trustItem}>
      <Ionicons name={icon} size={16} color="rgba(255,255,255,0.85)" />
      <Text style={styles.trustLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24, paddingTop: 48 },
  hero: { alignItems: "center", marginBottom: 32 },
  logoRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: "#FFFFFF", fontWeight: "800", fontSize: 26, letterSpacing: 0.3 },
  tagline: { color: "rgba(255,255,255,0.75)", marginTop: 6, fontSize: 13 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  inputText: { flex: 1, paddingVertical: 12, color: colors.textPrimary },
  button: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  demoHint: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 14 },
  demoHintText: { color: colors.textSecondary, fontSize: 11 },
  trustRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 28, paddingHorizontal: 8 },
  trustItem: { alignItems: "center", gap: 6, flex: 1 },
  trustLabel: { color: "rgba(255,255,255,0.75)", fontSize: 10, textAlign: "center" },
});
