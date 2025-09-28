

import os
from datetime import datetime, timedelta
import requests


class ELDCalculator:
    """
    Electronic Logging Device (ELD) trip calculator for route, distance, and log compliance.
    """
    MAX_HOURS_8_DAYS = 70
    MAX_HOURS_DAY = 11
    MIN_REST_BREAK = 0.5  # 30 minutes
    FUEL_INTERVAL = 1000  # miles
    @staticmethod
    def get_route_legs(start, via, end):
        """
        Use Google Directions API to get real route legs and durations.
        Returns a list of legs with from, to, distance (miles), and duration (hours).
        """
        api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
        if not api_key:
            raise EnvironmentError('Google Maps API key not set in environment variable GOOGLE_MAPS_API_KEY')

        url = (
            f"https://maps.googleapis.com/maps/api/directions/json?origin={start}"
            f"&destination={end}&waypoints={via}&key={api_key}"
        )
        response = requests.get(url)
        data = response.json()
        if data['status'] != 'OK':
            raise requests.exceptions.RequestException(f"Google Directions API error: {data.get('error_message', data['status'])}")

        route = data['routes'][0]
        legs = []
        for leg in route['legs']:
            legs.append({
                'from': leg['start_address'],
                'to': leg['end_address'],
                'type': 'route_leg',
                'distance': round(leg['distance']['value'] / 1609.34, 2),  # meters to miles
                'driving_time': round(leg['duration']['value'] / 3600, 2)  # seconds to hours
            })
        return legs
    @staticmethod
    def calculate_trip_plan(current_location, pickup, dropoff, current_cycle_used):
        """
        Calculate optimal route, distance, and ELD-compliant daily logs.
        """
        total_distance = ELDCalculator.estimate_distance(current_location, pickup, dropoff)
        legs = ELDCalculator.split_into_legs(current_location, pickup, dropoff, total_distance, current_cycle_used)
        daily_logs = ELDCalculator.generate_daily_logs(legs, current_cycle_used)
        return {
            'route_instructions': legs,
            'daily_logs': daily_logs,
            'total_distance': total_distance
        }

    @staticmethod
    def estimate_distance(start, via, end):
        """
        Estimate total driving distance using Google Maps Distance Matrix API.
        Returns distance in miles.
        """
        api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
        if not api_key:
            raise EnvironmentError('Google Maps API key not set in environment variable GOOGLE_MAPS_API_KEY')

        total_distance_meters = 0
        locations = [start, via, end]
        for i in range(len(locations) - 1):
            origin = locations[i]
            destination = locations[i + 1]
            url = (
                f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}"
                f"&destinations={destination}&key={api_key}"
            )
            response = requests.get(url)
            data = response.json()
            if data['status'] != 'OK':
                raise requests.exceptions.RequestException(f"Google Maps API error: {data.get('error_message', data['status'])}")
            element = data['rows'][0]['elements'][0]
            if element['status'] != 'OK':
                raise requests.exceptions.RequestException(f"Distance Matrix error: {element['status']}")
            total_distance_meters += element['distance']['value']

        total_distance_miles = total_distance_meters / 1609.34
        return round(total_distance_miles, 2)

    @staticmethod
    def split_into_legs(start, via, end, total_distance, current_cycle_used):
        """
        Use real route legs from Google Directions API and add rest stops.
        """
        legs = ELDCalculator.get_route_legs(start, via, end)
        return ELDCalculator.add_rest_stops(legs, current_cycle_used)

    @staticmethod
    def add_rest_stops(legs, current_cycle_used):
        """
        Add required rest stops to each leg based on driving time and HOS rules.
        """
        updated_legs = []
        for leg in legs:
            # Calculate required breaks based on driving time
            driving_hours = leg['driving_time']
            rest_breaks = []
            if driving_hours > 8:
                rest_breaks.append({'after_hours': 8, 'duration': 0.5})
            leg['rest_stops'] = rest_breaks
            updated_legs.append(leg)
        return updated_legs

    @staticmethod
    def generate_daily_logs(legs, current_cycle_used):
        """
        Generate ELD-compliant daily logs based on real driving time from legs.
        Splits driving into legal daily limits and inserts breaks as required.
        """
        logs = []
        day_number = 1
        remaining_cycle_hours = ELDCalculator.MAX_HOURS_8_DAYS - current_cycle_used
        max_daily_drive = ELDCalculator.MAX_HOURS_DAY
        start_time = datetime.strptime('08:00', '%H:%M')
        leg_idx = 0
        leg_progress = 0.0  # hours driven in current leg

        while leg_idx < len(legs) and remaining_cycle_hours > 0:
            daily_log = {
                'day': day_number,
                'date': (datetime.now() + timedelta(days=day_number-1)).strftime('%Y-%m-%d'),
                'activities': []
            }
            hours_left_today = min(max_daily_drive, remaining_cycle_hours)
            current_time = start_time
            driving_today = 0.0
            break_taken = False

            while hours_left_today > 0 and leg_idx < len(legs):
                leg = legs[leg_idx]
                leg_hours = leg['driving_time'] - leg_progress
                drive_this_leg = min(leg_hours, hours_left_today)

                # Add driving activity
                drive_start = current_time.strftime('%H:%M')
                drive_end_time = current_time + timedelta(hours=drive_this_leg)
                drive_end = drive_end_time.strftime('%H:%M')
                daily_log['activities'].append({
                    'type': 'driving',
                    'duration': round(drive_this_leg, 2),
                    'start': drive_start,
                    'end': drive_end
                })
                current_time = drive_end_time
                driving_today += drive_this_leg
                hours_left_today -= drive_this_leg
                leg_progress += drive_this_leg

                # Insert break if more than 8 hours driven without a break
                if driving_today >= 8 and not break_taken and hours_left_today > 0:
                    break_start = current_time.strftime('%H:%M')
                    break_end_time = current_time + timedelta(minutes=30)
                    break_end = break_end_time.strftime('%H:%M')
                    daily_log['activities'].append({
                        'type': 'break',
                        'duration': 0.5,
                        'start': break_start,
                        'end': break_end
                    })
                    current_time = break_end_time
                    break_taken = True
                    hours_left_today -= 0.5

                # If finished this leg, move to next
                if abs(leg_progress - leg['driving_time']) < 0.01:
                    leg_idx += 1
                    leg_progress = 0.0
                else:
                    # Still have more to drive in this leg, continue next day
                    break

            logs.append(daily_log)
            day_number += 1
            remaining_cycle_hours -= driving_today

        return logs