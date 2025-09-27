
import TripForm from "../../components/TripForm/TripForm";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1  px-8 py-10">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary mb-2">
              Plan Your Trip
            </h2>
            <p className="text-gray-600">
              Enter your trip details to generate compliant route planning and
              ELD logs
            </p>
          </div>
          <TripForm />
        </div>
      </main>
    </div>
  );
}
