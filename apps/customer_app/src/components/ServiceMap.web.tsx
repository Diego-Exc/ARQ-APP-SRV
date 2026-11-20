import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  icon: string;
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

declare global {
  interface Window {
    L?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

let leafletPromise: Promise<void> | null = null;

// Mapa real (pan/zoom/tiles) solo para web, cargado desde CDN en caliente:
// evita instalar react-leaflet (y el riesgo de romper el bundle de Metro,
// como pasó con react-native-maps) usando la API imperativa de Leaflet
// directo sobre un <View> cuyo nodo DOM subyacente sirve de contenedor.
function loadLeaflet(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.L) return Promise.resolve();
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      if (window.L) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el mapa"));
    document.head.appendChild(script);
  });
  return leafletPromise;
}

export function ServiceMap({ markers, region, style }: Props): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const markersLayerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then(() => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = window.L;
      mapRef.current = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(
        [region.latitude, region.longitude],
        14,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
    // Solo se inicializa una vez; los cambios de region/markers se aplican en los efectos de abajo.
  }, []);

  useEffect(() => {
    const L = typeof window !== "undefined" ? window.L : undefined;
    if (!L || !mapRef.current) return;
    const bounds = L.latLngBounds(
      [region.latitude - region.latitudeDelta / 2, region.longitude - region.longitudeDelta / 2],
      [region.latitude + region.latitudeDelta / 2, region.longitude + region.longitudeDelta / 2],
    );
    mapRef.current.fitBounds(bounds, { padding: [24, 24] });
  }, [region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta]);

  useEffect(() => {
    const L = typeof window !== "undefined" ? window.L : undefined;
    if (!L || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();
    markers.forEach((marker) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;border-radius:14px;background:${marker.color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
        iconSize: [28, 28],
      });
      L.marker([marker.lat, marker.lng], { icon }).addTo(markersLayerRef.current);
    });
  }, [markers]);

  return <View ref={containerRef as never} style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#DCE9F7" },
});
