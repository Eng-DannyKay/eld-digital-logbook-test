
type Trip = { distance: number; duration: string; stops: { label: string }[] };

type TripRecapProps = { readonly trip: Trip };

export default function TripRecap({ trip }: TripRecapProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
      <p>
        <span className="font-medium text-secondary">Distance:</span>{" "}
        {trip.distance} miles
      </p>
      <p>
        <span className="font-medium text-secondary">Duration:</span>{" "}
        {trip.duration}
      </p>
      <p>
        <span className="font-medium text-secondary">Stops:</span>{" "}
        {trip.stops.map((s) => s.label).join(", ")}
      </p>
    </div>
  );
}
