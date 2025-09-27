import axios from "axios";
import type { Trip, TripInput, TripResponse } from "../core/types/trip";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function calculateTrip(payload: TripInput): Promise<TripResponse> {
  const res = await API.post<TripResponse>("/calculate-trip/", payload);
  return res.data;
}

export async function listTrips(): Promise<Trip[]> {
  const res = await API.get<Trip[]>("/trips/");
  return res.data;
}
