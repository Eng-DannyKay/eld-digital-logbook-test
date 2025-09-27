export interface TripInput {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleHours: number;
  departAt?: string;
}
