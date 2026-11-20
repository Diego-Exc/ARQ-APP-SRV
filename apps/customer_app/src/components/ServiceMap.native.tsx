import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

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

export function ServiceMap({ markers, region, style }: Props): React.JSX.Element {
  return (
    <MapView provider={PROVIDER_DEFAULT} style={style} region={region}>
      {markers.map((marker) => (
        <Marker key={marker.id} coordinate={{ latitude: marker.lat, longitude: marker.lng }}>
          <View style={[styles.pin, { backgroundColor: marker.color }]}>
            <Ionicons name={marker.icon} size={16} color="#FFFFFF" />
          </View>
        </Marker>
      ))}
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
});
