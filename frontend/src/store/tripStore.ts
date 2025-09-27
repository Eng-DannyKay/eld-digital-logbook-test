import { create } from "zustand";
import { calculateTrip, listTrips } from "../services/api";
import type { Trip, TripResponse, TripInput } from "../core/types/trip";

interface TripState {
  currentTrip: TripResponse | null;
  trips: Trip[];
  loading: boolean;
  error: string | null;
  calculateTripAction: (payload: TripInput) => Promise<void>;
  fetchTrips: () => Promise<void>;
  clearTrip: () => void;
};

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  trips: [],
  loading: false,
  error: null,

  calculateTripAction: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await calculateTrip(payload);
      set({ currentTrip: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to calculate trip",
        loading: false,
      });
    }
  },

  fetchTrips: async () => {
    set({ loading: true, error: null });
    try {
      const trips = await listTrips();
      set({ trips, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch trips",
        loading: false,
      });
    }
  },

  clearTrip: () => set({ currentTrip: null }),
}));
