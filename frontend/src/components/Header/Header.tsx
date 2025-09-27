import { Truck } from "lucide-react";

export default function Header() {
  return (
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
  );
}
