export interface TripInput  {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string; 
};

export interface RouteInstruction {
  from: string;
  to: string;
  type: "to_pickup" | "to_dropoff";
  distance: number;
  driving_time: number;
  rest_stops: {
    after_hours: number;
    duration: number;
  }[];
};

export interface Activity {
  type: "driving" | "break" | "on_duty" | "off_duty";
  duration: number;
  start: string; 
  end: string;   
};

export interface DailyLog {
  day: number;
  date: string;
  activities: Activity[];
};

export interface Calculation {
  route_instructions: RouteInstruction[];
  daily_logs: DailyLog[];
  total_distance: number;
};

export interface Trip {
  id: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string;
  created_at: string;
  legs: unknown[]; 
  daily_logs: unknown[]; 
};

export interface TripResponse {
  calculation: Calculation;
  trip: Trip;
};
