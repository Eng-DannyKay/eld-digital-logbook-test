import math
from datetime import datetime, timedelta

class ELDCalculator:
    MAX_HOURS_8_DAYS = 70
    MAX_HOURS_DAY = 11
    MIN_REST_BREAK = 0.5  # 30 minutes
    FUEL_INTERVAL = 1000  # miles
    
    @staticmethod
    def calculate_trip_plan(current_location, pickup, dropoff, current_cycle_used):
        # This would integrate with a mapping API
        # For now, mock the route calculation
        total_distance = ELDCalculator.estimate_distance(current_location, pickup, dropoff)
        
        legs = ELDCalculator.split_into_legs(
            current_location, pickup, dropoff, total_distance, current_cycle_used
        )
        
        daily_logs = ELDCalculator.generate_daily_logs(legs, current_cycle_used)
        
        return {
            'route_instructions': legs,
            'daily_logs': daily_logs,
            'total_distance': total_distance
        }
    
    @staticmethod
    def estimate_distance(start, via, end):
        # Mock distance calculation - integrate with Google Maps/Distance Matrix API
        # Return distance in miles
        return 1200  # Example distance
    
    @staticmethod
    def split_into_legs(start, via, end, total_distance, current_cycle_used):
        legs = []
        # Add leg from current location to pickup
        legs.append({
            'from': start,
            'to': via,
            'type': 'to_pickup',
            'distance': total_distance * 0.3  # Mock data
        })
        
        # Add leg from pickup to dropoff
        legs.append({
            'from': via,
            'to': end,
            'type': 'to_dropoff',
            'distance': total_distance * 0.7  # Mock data
        })
        
        return ELDCalculator.add_rest_stops(legs, current_cycle_used)
    
    @staticmethod
    def add_rest_stops(legs, current_cycle_used):
        # Implement HOS rules for rest stops
        updated_legs = []
        for leg in legs:
            # Calculate required breaks based on driving time
            driving_hours = leg['distance'] / 50  # Assuming 50 mph average
            rest_breaks = []
            
            if driving_hours > 8:
                rest_breaks.append({'after_hours': 8, 'duration': 0.5})
            
            leg['driving_time'] = driving_hours
            leg['rest_stops'] = rest_breaks
            updated_legs.append(leg)
        
        return updated_legs
    
    @staticmethod
    def generate_daily_logs(legs, current_cycle_used):
        # Generate ELD-compliant daily logs
        logs = []
        day_number = 1
        remaining_hours = ELDCalculator.MAX_HOURS_8_DAYS - current_cycle_used
        
        for leg in legs:
            daily_log = {
                'day': day_number,
                'date': (datetime.now() + timedelta(days=day_number-1)).strftime('%Y-%m-%d'),
                'activities': []
            }
            
            # Add driving activities with breaks
            # This is simplified - actual implementation would be more complex
            daily_log['activities'].extend([
                {'type': 'driving', 'duration': 4, 'start': '08:00', 'end': '12:00'},
                {'type': 'break', 'duration': 0.5, 'start': '12:00', 'end': '12:30'},
                {'type': 'driving', 'duration': 4, 'start': '12:30', 'end': '16:30'},
            ])
            
            logs.append(daily_log)
            day_number += 1
            remaining_hours -= 8  # Simplified
            
            if remaining_hours <= 0:
                break
        
        return logs