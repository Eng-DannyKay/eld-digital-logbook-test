import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import ELDLogRenderer from "../../components/ELDLog/ELDLogRenderer";
import ELDLogSheet from "../../components/ELDLog/ELDLogSheet";
import MapView from "../../components/Map/MapView";
import ComplianceSummary from "../../components/Summary/ComplianceSummary";
import TripRecap from "../../components/Summary/TripRecap";
import ComplianceAlert from "../../components/Summary/ComplianceAlert";

export default function TripDetails() {
  const navigate = useNavigate();

  // TODO: Replace with backend/store data
  const trip = {
    current: "Houston, TX",
    pickup: "Dallas, TX",
    dropoff: "Chicago, IL",
    distance: 1090,
    duration: "18h 30m",
    stops: [
      { lat: 35.2, lng: -96.9, label: "Fuel Stop" },
      { lat: 38.6, lng: -90.2, label: "Rest Stop" },
    ],
    route: [
      { lat: 29.76, lng: -95.36 },
      { lat: 32.78, lng: -96.8 },
      { lat: 41.88, lng: -87.62 },
    ],
    logs: [
      {
        day: 1,
        entries: [
          { from: 0, to: 8, status: "Off" as const },
          { from: 8, to: 16, status: "Driving" as const },
          { from: 16, to: 20, status: "OnDuty" as const },
          { from: 20, to: 24, status: "Sleeper" as const },
        ],
      },
      {
        day: 2,
        entries: [
          { from: 0, to: 7, status: "Off" as const },
          { from: 7, to: 15, status: "Driving" as const },
          { from: 15, to: 17, status: "OnDuty" as const },
          { from: 17, to: 24, status: "Sleeper" as const },
        ],
      },
    ],
    logData: {
      sheets: [
        {
          date: "2025-09-26",
          driver: "Professional Driver",
          vehicle: "Truck #1001",
          dutyChart: [
            Array(8).fill(true).concat(Array(16).fill(false)),
            Array(24).fill(false),
            Array(8).fill(false).concat(Array(8).fill(true)).concat(Array(8).fill(false)),
            Array(16).fill(false).concat(Array(8).fill(true)),
          ],
          summary: {
            drivingTime: "8:00",
            onDutyTime: "8:00",
            cycleHours: "56:00",
            availableHours: "14:00",
          },
          remarks: "Trip from Dallas to Chicago. Includes fuel + rest stop compliance.",
        },
      ],
    },
    compliance: { hoursToday: 9, cycleUsed: 66, remaining: 4 },
    complianceAlerts: [
      "You are approaching the 70-hour / 8-day cycle limit.",
      "Mandatory 10-hour break required within 2 hours."
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-secondary">Trip Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {trip.current} → {trip.pickup} → {trip.dropoff}
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
          {trip.complianceAlerts && trip.complianceAlerts.length > 0 && (
            <ComplianceAlert alerts={trip.complianceAlerts} />
          )}
          <h2 className="font-semibold text-lg mb-3 text-secondary">Route Overview</h2>
          <MapView route={trip.route} markers={trip.stops} />
        </motion.div>
        <motion.aside
          className="bg-white rounded-lg shadow-md p-5 space-y-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="font-semibold text-lg text-secondary mb-2">Trip Summary</h2>
            <TripRecap trip={trip} />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-secondary mb-2">Compliance</h2>
            <ComplianceSummary compliance={trip.compliance} />
          </div>
        </motion.aside>
      </div>

      <motion.section
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="font-semibold text-lg mb-6 text-secondary">Driver Logs (Quick Overview)</h2>
        <div className="grid gap-8">
          {trip.logs.map((log) => (
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
        <h2 className="font-semibold text-lg mb-6 text-secondary">Detailed Log Sheet</h2>
        <ELDLogSheet logData={trip.logData} />
      </motion.section>

      <footer className="flex justify-end gap-4">
        <Button variant="secondary">Print</Button>
        <Button variant="primary">Export PDF</Button>
      </footer>
    </div>
  );
}
