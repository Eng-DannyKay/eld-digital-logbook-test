

import { useState } from "react";
import { Clock, MapPin, Navigation, Route as RouteIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InputCard from "../InputCard/InputCard";
import { Button } from "../Button/Button";
import { useTripStore } from "../../store/tripStore";
import { useToastStore } from "../../store/toastStore";
import LocationInput from "../LocationInput/LocationInput";

export default function TripForm() {
  const [form, setForm] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: 0,
  });
  const [errors, setErrors] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: "",
  });

  const isFormInvalid =
  !form.currentLocation ||
  !form.pickupLocation ||
  !form.dropoffLocation ||
  form.currentCycleUsed < 0 ||
  form.currentCycleUsed > 70;

const showToast = useToastStore((state) => state.showToast);


  const { calculateTripAction, loading, error } = useTripStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {
      currentLocation: "",
      pickupLocation: "",
      dropoffLocation: "",
      currentCycleUsed: "",
    };
    if (!form.currentLocation.trim()) newErrors.currentLocation = "Current location is required.";
    if (!form.pickupLocation.trim()) newErrors.pickupLocation = "Pickup location is required.";
    if (!form.dropoffLocation.trim()) newErrors.dropoffLocation = "Drop-off location is required.";
    if (form.currentCycleUsed < 0 || form.currentCycleUsed > 70) {
      newErrors.currentCycleUsed = "Current cycle used must be between 0 and 70.";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await calculateTripAction({
      current_location: form.currentLocation,
      pickup_location: form.pickupLocation,
      dropoff_location: form.dropoffLocation,
      current_cycle_used: form.currentCycleUsed.toString(),
    });
   
    if (!error) {
      showToast("Trip planned successfully!", "success");
      navigate("/trip");
    }else{
      showToast(`Error:Failed to calculate trip ${error}`, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputCard title={<span>Current Location <span className="text-red-500">*</span></span>} icon={MapPin}>
          <LocationInput
            value={form.currentLocation}
            onChange={(val) => handleChange("currentLocation", val)}
            placeholder="Enter current location"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
          {errors.currentLocation && <p className="text-xs text-red-500 mt-1">{errors.currentLocation}</p>}
        </InputCard>

        <InputCard title={<span>Current Cycle Used <span className="text-red-500">*</span></span>} icon={Clock}>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0"
              max="70"
              step="0.5"
              value={form.currentCycleUsed}
              onChange={(e) => handleChange("currentCycleUsed", parseFloat(e.target.value))}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">hours</span>
          </div>
          {errors.currentCycleUsed && <p className="text-xs text-red-500 mt-1">{errors.currentCycleUsed}</p>}
        </InputCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard title={<span>Pickup Location <span className="text-red-500">*</span></span>} icon={Navigation}>
          <LocationInput
            value={form.pickupLocation}
            onChange={(val) => handleChange("pickupLocation", val)}
            placeholder="Enter pickup location"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
          {errors.pickupLocation && <p className="text-xs text-red-500 mt-1">{errors.pickupLocation}</p>}
        </InputCard>

        <InputCard title={<span>Drop-off Location <span className="text-red-500">*</span></span>} icon={MapPin}>
          <LocationInput
            value={form.dropoffLocation}
            onChange={(val) => handleChange("dropoffLocation", val)}
            placeholder="Enter drop-off location"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
          {errors.dropoffLocation && <p className="text-xs text-red-500 mt-1">{errors.dropoffLocation}</p>}
        </InputCard>
      </div>

      {error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading || isFormInvalid}
          loading={loading}
          icon={<RouteIcon className="w-5 h-5" />}
        >
          Plan Trip
        </Button>
      </div>
    </div>
  );
}
