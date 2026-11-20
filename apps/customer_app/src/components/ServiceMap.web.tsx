import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import type { GeoPoint } from "../api/client";

interface Props {
  home: GeoPoint;
  technician: GeoPoint;
  style?: object;
}

// react-native-maps es un módulo nativo (iOS/Android); en web se reemplaza
// por esta vista ilustrativa con las mismas coordenadas, para que la demo en
// navegador no dependa de un mapa embebido real.
export function ServiceMap({ home, technician, style }: Props): React.JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.grid} />
      <View style={[styles.pin, styles.pinHome, { left: "35%", top: "60%" }]}>
        <Ionicons name="home" size={16} color="#FFFFFF" />
      </View>
      <View style={[styles.pin, styles.pinTechnician, { left: "60%", top: "35%" }]}>
        <Ionicons name="construct" size={16} color="#FFFFFF" />
      </View>
      <View style={styles.coordsBox}>
        <Text style={styles.coordsText}>
          Tú: {home.lat.toFixed(4)}, {home.lng.toFixed(4)}
        </Text>
        <Text style={styles.coordsText}>
          Técnico: {technician.lat.toFixed(4)}, {technician.lng.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DCE9F7",
    overflow: "hidden",
  },
  grid: { ...StyleSheet.absoluteFill, opacity: 0.4 },
  pin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: -15,
    marginTop: -15,
  },
  pinHome: { backgroundColor: colors.primary },
  pinTechnician: { backgroundColor: colors.accent },
  coordsBox: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    padding: 6,
  },
  coordsText: { fontSize: 10, color: colors.textSecondary },
});
