import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Route, Navigation } from "lucide-react";

type Props = {
  route?: { lat: number; lng: number }[];
  markers?: { lat: number; lng: number; label?: string }[];
};

export default function MapView({ route = [], markers = [] }: Props) {
  const center = route.length
    ? [route[0].lat, route[0].lng]
    : [39.8283, -98.5795]; // default: US center

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Route className="w-6 h-6 text-blue-600 mr-2" />
        Route Overview
      </h3>

      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center as any}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m, i) => (
            <Marker key={i} position={[m.lat, m.lng] as [number, number]}>
              <Popup>{m.label || "Stop"}</Popup>
            </Marker>
          ))}
          {route.length > 0 && (
            <Polyline
              positions={route.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: "#2563eb", weight: 4 }}
            />
          )}
        </MapContainer>
      </div>

      {route.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-8 text-center mt-4">
          <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Route map will appear here after planning
          </p>
        </div>
      )}
    </div>
  );
}
