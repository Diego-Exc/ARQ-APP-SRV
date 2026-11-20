import type { GeoPoint } from "../api/client";

// Ubicación registrada de referencia (El Poblado, Medellín), compartida por
// todas las pantallas del flujo demo (ver ADR-0005: ubicación simulada).
export const CLIENT_LOCATION: GeoPoint = { lat: 6.209, lng: -75.5679 };

const KM_PER_DEGREE_LAT = 111.32;

// Deriva un punto de partida plausible para el técnico a partir de la
// distancia que ya calculó el backend (MatchingScorer), para poder dibujar
// un mapa real sin exponer lat/lng del técnico por la API (fuera de alcance).
export function technicianStartPoint(distanceKm: number): GeoPoint {
  const bearingRad = (45 * Math.PI) / 180;
  const kmPerDegreeLng = KM_PER_DEGREE_LAT * Math.cos((CLIENT_LOCATION.lat * Math.PI) / 180);
  return {
    lat: CLIENT_LOCATION.lat + (distanceKm * Math.cos(bearingRad)) / KM_PER_DEGREE_LAT,
    lng: CLIENT_LOCATION.lng + (distanceKm * Math.sin(bearingRad)) / kmPerDegreeLng,
  };
}

export function lerpPoint(from: GeoPoint, to: GeoPoint, t: number): GeoPoint {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

const MIN_DELTA = 0.02;

// Encuadra una región de mapa que contenga todos los puntos dados, con un
// margen proporcional, usada tanto en el mapa de exploración del Home como
// en Tracking.
export function regionForPoints(points: GeoPoint[]): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 2.2, MIN_DELTA),
    longitudeDelta: Math.max((maxLng - minLng) * 2.2, MIN_DELTA),
  };
}
