import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { api } from "../api/client";
import { confirmAlert, showAlert } from "../utils/alert";
import type { MainTabParamList, RootStackParamList } from "../navigation/AppNavigator";

type Props = BottomTabScreenProps<MainTabParamList, "AccountTab">;

export function AccountScreen({ navigation }: Props): React.JSX.Element {
  const name = api.currentUserName ?? "Cliente ArreglaPues";
  // Notifications y Login viven en el Stack raiz, no dentro del Tab.Navigator:
  // hay que subir con getParent() para navegar/resetear fuera de las pestañas.
  const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>();

  function handleLogout() {
    confirmAlert(
      "Cerrar sesión",
      "¿Seguro que quieres salir de tu cuenta?",
      () => {
        api.logout();
        rootNavigation?.reset({ index: 0, routes: [{ name: "Login" }] });
      },
      { confirmLabel: "Cerrar sesión", destructive: true },
    );
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
        <MenuRow icon="notifications-outline" label="Notificaciones" onPress={() => rootNavigation?.navigate("Notifications")} />
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
      onPress={onPress ?? (() => showAlert(label, "Próximamente disponible."))}
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
