import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import type { GeoPoint } from "../api/client";

interface Props {
  home: GeoPoint;
  technician: GeoPoint;
  style?: object;
}

export function ServiceMap({ home, technician, style }: Props): React.JSX.Element {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={style}
      initialRegion={{
        latitude: (home.lat + technician.lat) / 2,
        longitude: (home.lng + technician.lng) / 2,
        latitudeDelta: Math.max(Math.abs(home.lat - technician.lat) * 2.5, 0.02),
        longitudeDelta: Math.max(Math.abs(home.lng - technician.lng) * 2.5, 0.02),
      }}
    >
      <Marker coordinate={{ latitude: home.lat, longitude: home.lng }} title="Tu dirección">
        <View style={[styles.pin, styles.pinHome]}>
          <Ionicons name="home" size={16} color="#FFFFFF" />
        </View>
      </Marker>
      <Marker coordinate={{ latitude: technician.lat, longitude: technician.lng }} title="Técnico">
        <View style={[styles.pin, styles.pinTechnician]}>
          <Ionicons name="construct" size={16} color="#FFFFFF" />
        </View>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  pinHome: { backgroundColor: colors.primary },
  pinTechnician: { backgroundColor: colors.accent },
});
