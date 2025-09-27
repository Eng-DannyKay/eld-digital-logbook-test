
import { Truck } from "lucide-react";
import TripForm from "../../components/TripForm/TripForm";
import Footer from "../../components/Footer/Footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-gradient-to-r from-primary-dark to-primary text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center space-x-3">
          <Truck className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">ELD Trip Planner</h1>
            <p className="text-primary-light">
              Professional Route Planning & Electronic Logging
            </p>
          </div>
        </div>
      </header>


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

      <Footer />
    </div>
  );
}
