import { useEffect, useRef } from "react";

type MapViewProps = {
  readonly from: string;
  readonly to: string;
  readonly waypoints?: readonly string[];
  readonly restStops?: readonly { location: string; label: string }[];
};

export default function MapView({
  from,
  to,
  waypoints = [],
  restStops = [],
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 7.9465, lng: -1.0232 },
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
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

          const bounds = new google.maps.LatLngBounds();
          const geocoder = new google.maps.Geocoder();

          const addMarker = (
            position: google.maps.LatLngLiteral,
            label: string,
            title: string
          ) => {
            bounds.extend(position);
            new google.maps.Marker({
              position,
              map,
              label,
              title,
            });
          };

          geocoder.geocode({ address: from }, (results, geoStatus) => {
            if (geoStatus === "OK" && results?.[0]) {
              addMarker(
                results[0].geometry.location.toJSON(),
                "S",
                "Start Location"
              );
            }
          });

          waypoints.forEach((wp, idx) => {
            geocoder.geocode({ address: wp }, (results, geoStatus) => {
              if (geoStatus === "OK" && results?.[0]) {
                addMarker(
                  results[0].geometry.location.toJSON(),
                  `${idx + 1}`,
                  `Waypoint ${idx + 1}`
                );
              }
            });
          });

          geocoder.geocode({ address: to }, (results, geoStatus) => {
            if (geoStatus === "OK" && results?.[0]) {
              addMarker(
                results[0].geometry.location.toJSON(),
                "D",
                "Destination"
              );
              map.fitBounds(bounds);
            }
          });

          restStops.forEach((stop) => {
            geocoder.geocode(
              { address: stop.location },
              (results, geoStatus) => {
                if (geoStatus === "OK" && results?.[0]) {
                  new google.maps.Marker({
                    position: results[0].geometry.location,
                    map,
                    label: stop.label,
                    title: `Rest Stop: ${stop.label} at ${stop.location}`,
                    icon: {
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    },
                  });
                }
              }
            );
          });
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }, [from, to, waypoints, restStops]);

  return (
    <>
      <div className="sr-only" aria-live="polite">
        Trip from {from} to {to} with {waypoints.length} waypoints and{" "}
        {restStops.length} rest stops.
      </div>

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg shadow"
        aria-label={`Map showing route from ${from} to ${to} with stops.`}
      />
    </>
  );
}
