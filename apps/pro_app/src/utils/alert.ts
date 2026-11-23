import { Alert, Platform } from "react-native";

// Alert.alert de React Native es un no-op en react-native-web (no hace nada
// en el navegador). Estas funciones usan window.alert/confirm en web y
// Alert.alert nativo en iOS/Android.

export function showAlert(title: string, message?: string): void {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export function confirmAlert(
  title: string,
  message: string,
  onConfirm: () => void,
  options?: { confirmLabel?: string; destructive?: boolean },
): void {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    {
      text: options?.confirmLabel ?? "Confirmar",
      style: options?.destructive ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
}
