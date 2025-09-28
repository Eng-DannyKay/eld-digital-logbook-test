# ELD Trip Calculation Documentation

This document explains how the Electronic Logging Device (ELD) trip calculations are performed in the `eld_calculator.py` module.

## Overview
The ELD calculator is designed to help plan truck trips in compliance with Hours of Service (HOS) regulations. It calculates optimal routes, total distance, and generates daily driving logs that respect legal driving limits and required rest breaks.

## Calculation Steps

### 1. Route and Distance Calculation
- **Route Legs**: The calculator uses the Google Directions API to determine the actual driving route, including all waypoints. Each leg contains:
  - Start and end addresses
  - Distance (in miles)
  - Driving time (in hours)
- **Distance Estimation**: The Google Distance Matrix API is used to estimate the total driving distance between the start, via, and end locations.

### 2. Splitting the Trip into Legs
- The trip is split into legs based on the route from the Directions API.
- Each leg is analyzed for required rest stops based on driving time and HOS rules.

### 3. Adding Rest Stops
- If a leg's driving time exceeds 8 hours, a 30-minute rest break is inserted after 8 hours of driving.
- Rest stops are added to ensure compliance with HOS regulations.

### 4. Generating Daily Logs
- The trip is divided into daily logs, each representing a legal driving day.
- Each day includes:
  - Driving activities (with start/end times and durations)
  - Required breaks (e.g., 30-minute break after 8 hours)
- The daily driving limit is 11 hours, and the total cycle limit is 70 hours in 8 days.
- The log generation algorithm:
  1. Tracks remaining cycle hours and daily driving limits.
  2. Schedules driving and breaks, splitting legs across days if needed.
  3. Ensures no more than 11 hours of driving per day and inserts breaks as required.

## Key Constants
- **MAX_HOURS_8_DAYS**: 70 hours (max driving in 8 days)
- **MAX_HOURS_DAY**: 11 hours (max driving per day)
- **MIN_REST_BREAK**: 0.5 hours (30 minutes)

## Example Output
The output includes:
- `route_instructions`: List of route legs with distances and driving times
- `daily_logs`: List of daily logs with driving and break activities
- `total_distance`: Total trip distance in miles

---
For more details, see the code in `eld_calculator.py`.
