import { useEffect, useRef } from "react";

type MapViewProps = {
  readonly from: string;
  readonly to: string;
  readonly waypoints?: readonly string[];
};

export default function MapView({ from, to, waypoints = [] }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 7.9465, lng: -1.0232 }, // Ghana center
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: from,
        destination: to,
        waypoints: waypoints.map((loc) => ({ location: loc, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }, [from, to, waypoints]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow" />;
}
