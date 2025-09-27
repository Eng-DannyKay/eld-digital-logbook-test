import type { Trip, Calculation } from "../../core/types/trip";

type TripRecapProps = {
  readonly calculation: Calculation;
  readonly trip: Trip;
};

export default function TripRecap({ calculation, trip }: TripRecapProps) {
  const totalHours = calculation.daily_logs.reduce(
    (acc, log) =>
      acc +
      log.activities.reduce((sum, activity) => sum + activity.duration, 0),
    0
  );

  const duration = `${Math.floor(totalHours)}h ${Math.round(
    (totalHours % 1) * 60
  )}m`;

  const stops =
    calculation.route_instructions.flatMap((leg) =>
      leg.rest_stops.map((stop) => {
        if (stop.duration >= 10) return "Rest Break";
        if (stop.duration >= 0.5) return "Fuel Stop";
        return "Stop";
      })
    ) ?? [];

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
      <p>
        <span className="font-medium text-secondary">Route:</span>{" "}
        {trip.pickup_location} → {trip.dropoff_location}
      </p>
      <p>
        <span className="font-medium text-secondary">Distance:</span>{" "}
        {calculation.total_distance} miles
      </p>
      <p>
        <span className="font-medium text-secondary">Duration:</span> {duration}
      </p>
      <p>
        <span className="font-medium text-secondary">Stops:</span>{" "}
        {stops.length > 0 ? stops.join(", ") : "None"}
      </p>
    </div>
  );
}
