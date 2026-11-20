import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  markers: MapMarker[];
  region: MapRegion;
  style?: object;
}

// react-native-maps es nativo (iOS/Android); en web se posicionan los
// marcadores proporcionalmente dentro de un lienzo con la misma región,
// para mantener la misma composición visual sin un mapa real embebido.
export function ServiceMap({ markers, region, style }: Props): React.JSX.Element {
  const minLat = region.latitude - region.latitudeDelta / 2;
  const minLng = region.longitude - region.longitudeDelta / 2;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.gridRow} />
      <View style={[styles.gridRow, { top: "50%" }]} />
      <View style={styles.gridCol} />
      <View style={[styles.gridCol, { left: "50%" }]} />
      {markers.map((marker) => {
        const leftPct = ((marker.lng - minLng) / region.longitudeDelta) * 100;
        const topPct = (1 - (marker.lat - minLat) / region.latitudeDelta) * 100;
        return (
          <View
            key={marker.id}
            style={[
              styles.pin,
              { backgroundColor: marker.color, left: `${leftPct}%`, top: `${topPct}%` },
            ]}
          >
            <Ionicons name={marker.icon} size={14} color="#FFFFFF" />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#DCE9F7", overflow: "hidden" },
  gridRow: { position: "absolute", left: 0, right: 0, top: "25%", height: 1, backgroundColor: "rgba(30,58,95,0.08)" },
  gridCol: { position: "absolute", top: 0, bottom: 0, left: "25%", width: 1, backgroundColor: "rgba(30,58,95,0.08)" },
  pin: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: -14,
    marginTop: -14,
  },
});
