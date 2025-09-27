import { useState } from "react";

import {
    Clock,
    MapPin,
    Navigation,
    Route as RouteIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputCard from "../InputCard/InputCard";
import { Button } from "../Button/Button";




export default function TripForm() {

  const [form, setForm] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: "",
  });
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {
      currentLocation: "",
      pickupLocation: "",
      dropoffLocation: "",
      currentCycleUsed: "",
    };
    if (!form.currentLocation.trim()) {
      newErrors.currentLocation = "Current location is required.";
    }
    if (!form.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required.";
    }
    if (!form.dropoffLocation.trim()) {
      newErrors.dropoffLocation = "Drop-off location is required.";
    }
    if (
      form.currentCycleUsed === null ||
      form.currentCycleUsed === undefined ||
      isNaN(form.currentCycleUsed) ||
      form.currentCycleUsed < 0 ||
      form.currentCycleUsed > 70
    ) {
      newErrors.currentCycleUsed = "Current cycle used must be between 0 and 70.";
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.values(newErrors).every((err) => !err);
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/trip", { state: form });
    }, 1500);
  };


  const isFormValid = () => {
    return (
      form.currentLocation.trim() &&
      form.pickupLocation.trim() &&
      form.dropoffLocation.trim() &&
      form.currentCycleUsed >= 0 &&
      form.currentCycleUsed <= 70 &&
      Object.values(errors).every((err) => !err)
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputCard title={<span>Current Location <span className="text-red-500">*</span></span>} icon={MapPin}>
          <input
            type="text"
            value={form.currentLocation}
            onChange={(e) => handleChange("currentLocation", e.target.value)}
            placeholder="Enter current location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          {errors.currentLocation && (
            <p className="text-xs text-red-500 mt-1">{errors.currentLocation}</p>
          )}
        </InputCard>

        <InputCard title={<span>Current Cycle Used <span className="text-red-500">*</span></span>} icon={Clock}>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0"
              max="70"
              step="0.5"
              value={form.currentCycleUsed}
              onChange={(e) =>
                handleChange("currentCycleUsed", parseFloat(e.target.value) || 0)
              }
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              hours
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Maximum 70 hours per 8-day cycle
          </p>
          {errors.currentCycleUsed && (
            <p className="text-xs text-red-500 mt-1">{errors.currentCycleUsed}</p>
          )}
        </InputCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard title={<span>Pickup Location <span className="text-red-500">*</span></span>} icon={Navigation}>
          <input
            type="text"
            value={form.pickupLocation}
            onChange={(e) => handleChange("pickupLocation", e.target.value)}
            placeholder="Enter pickup location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          {errors.pickupLocation && (
            <p className="text-xs text-red-500 mt-1">{errors.pickupLocation}</p>
          )}
        </InputCard>

        <InputCard title={<span>Drop-off Location <span className="text-red-500">*</span></span>} icon={MapPin}>
          <input
            type="text"
            value={form.dropoffLocation}
            onChange={(e) => handleChange("dropoffLocation", e.target.value)}
            placeholder="Enter drop-off location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          {errors.dropoffLocation && (
            <p className="text-xs text-red-500 mt-1">{errors.dropoffLocation}</p>
          )}
        </InputCard>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
          loading={loading}
          icon={<RouteIcon className="w-5 h-5" />}
        >
          Plan Trip
        </Button>
      </div>
    </div>
  );
}
