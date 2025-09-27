import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import ELDLogRenderer from "../../components/ELDLog/ELDLogRenderer";
import ELDLogSheet from "../../components/ELDLog/ELDLogSheet";
import MapView from "../../components/Map/MapView";
import ComplianceSummary from "../../components/Summary/ComplianceSummary";
import TripRecap from "../../components/Summary/TripRecap";
import { useTripStore } from "../../store/tripStore";
import type { DailyLog } from "../../core/types/trip";
import { generateDutyChart } from "../../core/utils/logUtils";

export default function TripDetails() {
  const navigate = useNavigate();
  const { currentTrip } = useTripStore();

  if (!currentTrip) {
    navigate("/");
    return null;
  }

  const { calculation, trip } = currentTrip;

  const formattedLogs = calculation.daily_logs.map((log: DailyLog) => ({
    day: log.day,
    entries: log.activities.map((activity) => {
      let status: "Driving" | "Off" | "OnDuty" | "Sleeper" = "Off";
      switch (activity.type) {
        case "driving":
          status = "Driving";
          break;
        case "break":
          break;
        case "on_duty":
          status = "OnDuty";
          break;
        case "off_duty":
          status = "Sleeper";
          break;
      }
      const [startH] = activity.start.split(":").map(Number);
      const [endH] = activity.end.split(":").map(Number);
      return { from: startH, to: endH, status };
    }),
  }));

  const compliance = {
    hoursToday:
      formattedLogs[0]?.entries.reduce(
        (acc, e) => (e.status === "Driving" ? acc + (e.to - e.from) : acc),
        0
      ) || 0,
    cycleUsed: parseFloat(trip.current_cycle_used),
    remaining: 70 - parseFloat(trip.current_cycle_used),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <header className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-secondary">Trip Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {trip.current_location} → {trip.pickup_location} →{" "}
            {trip.dropoff_location}
          </p>
        </motion.div>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Plan New Trip
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 bg-white rounded-lg shadow-md p-5"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Alerts (if we later add them from API) */}
          {/* <ComplianceAlert alerts={[]} /> */}

          <h2 className="font-semibold text-lg mb-3 text-secondary">
            Route Overview
          </h2>
          <MapView
            from={trip.current_location}
            to={trip.dropoff_location}
            waypoints={[trip.pickup_location]}
          />
        </motion.div>

        <motion.aside
          className="bg-white rounded-lg shadow-md p-5 space-y-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="font-semibold text-lg text-secondary mb-2">
              Trip Summary
            </h2>
            <TripRecap calculation={calculation} trip={trip} />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-secondary mb-2">
              Compliance
            </h2>
            <ComplianceSummary compliance={compliance} />
          </div>
        </motion.aside>
      </div>

      <motion.section
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="font-semibold text-lg mb-6 text-secondary">
          Driver Logs (Quick Overview)
        </h2>
        <div className="grid gap-8">
          {formattedLogs.map((log) => (
            <ELDLogRenderer key={log.day} day={log.day} entries={log.entries} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="font-semibold text-lg mb-6 text-secondary">
          Detailed Log Sheet
        </h2>
        <ELDLogSheet
          logData={{
            sheets: calculation.daily_logs.map((log) => ({
              date: log.date,
              driver: "Professional Driver",
              vehicle: "Truck #1001",
              dutyChart: generateDutyChart(log.activities),
              summary: {
                drivingTime: `${log.activities
                  .filter((a) => a.type === "driving")
                  .reduce((acc, a) => acc + a.duration, 0)}:00`,
                onDutyTime: `${log.activities
                  .filter((a) => a.type === "on_duty")
                  .reduce((acc, a) => acc + a.duration, 0)}:00`,
                cycleHours: trip.current_cycle_used,
                availableHours: (
                  70 - parseFloat(trip.current_cycle_used)
                ).toString(),
              },
              remarks: `Trip from ${trip.pickup_location} to ${trip.dropoff_location}`,
            })),
          }}
        />
      </motion.section>

      <footer className="flex justify-end gap-4">
        <Button variant="secondary">Print</Button>
        <Button variant="primary">Export PDF</Button>
      </footer>
    </div>
  );
}
