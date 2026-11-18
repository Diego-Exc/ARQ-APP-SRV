import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { proApi } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// Dos técnicos demo precargados en el backend (ver backend/src/bootstrap/server.ts):
// tecnico1.demo@arreglapues.app (plomería) y tecnico4.demo@arreglapues.app (electricidad),
// ambos con contraseña demo12345.
export function LoginScreen({ navigation }: Props): JSX.Element {
  const [email, setEmail] = useState("tecnico1.demo@arreglapues.app");
  const [password, setPassword] = useState("demo12345");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await proApi.login(email, password);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("No se pudo iniciar sesión", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>ArreglaPues Pro</Text>
      <Text style={styles.title}>Ingresa a tu cuenta de técnico</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 },
  brand: { color: colors.accent, fontWeight: "700", fontSize: 20, textAlign: "center", marginBottom: 4 },
  title: { color: colors.primary, fontWeight: "600", textAlign: "center", marginBottom: 24 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
});
