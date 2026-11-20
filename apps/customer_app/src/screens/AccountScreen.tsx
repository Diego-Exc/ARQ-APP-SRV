import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Account">;

export function AccountScreen({ navigation }: Props): React.JSX.Element {
  const name = api.currentUserName ?? "Cliente ArreglaPues";

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          api.logout();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={36} color={colors.accent} />
      </View>
      <Text style={styles.name}>{name}</Text>

      <View style={styles.menu}>
        <MenuRow icon="receipt-outline" label="Mis solicitudes" />
        <MenuRow icon="card-outline" label="Métodos de pago" />
        <MenuRow icon="location-outline" label="Direcciones guardadas" />
        <MenuRow icon="notifications-outline" label="Notificaciones" onPress={() => navigation.navigate("Notifications")} />
        <MenuRow icon="help-circle-outline" label="Ayuda y soporte" />
        <MenuRow icon="log-out-outline" label="Cerrar sesión" onPress={handleLogout} danger />
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={onPress ?? (() => Alert.alert(label, "Próximamente disponible."))}
    >
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textPrimary} />
      <Text style={[styles.menuRowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, alignItems: "center" },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginBottom: 24 },
  menu: { width: "100%", gap: 8 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  menuRowLabel: { flex: 1, color: colors.textPrimary, fontWeight: "600", fontSize: 13 },
});
