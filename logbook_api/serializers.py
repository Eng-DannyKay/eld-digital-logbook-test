from rest_framework import serializers
from .models import Trip, TripLeg, DailyLog

class TripLegSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripLeg
        fields = ['id', 'sequence', 'start_location', 'end_location', 'distance', 'driving_time', 'rest_stops']

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = ['id', 'day_number', 'log_data']

class TripInputSerializer(serializers.Serializer):
    current_location = serializers.CharField(
        max_length=255,
        help_text="Driver's current location (e.g., 'New York, NY')"
    )
    pickup_location = serializers.CharField(
        max_length=255,
        help_text="Package pickup location (e.g., 'Chicago, IL')"
    )
    dropoff_location = serializers.CharField(
        max_length=255,
        help_text="Package dropoff location (e.g., 'Los Angeles, CA')"
    )
    current_cycle_used = serializers.DecimalField(
        max_digits=5, 
        decimal_places=2,
        help_text="Current hours used in the 8-day cycle (e.g., 10.5)"
    )

class TripOutputSerializer(serializers.ModelSerializer):
    legs = TripLegSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 
            'current_location', 
            'pickup_location', 
            'dropoff_location', 
            'current_cycle_used',
            'created_at',
            'legs',
            'daily_logs'
        ]

class CalculationResultSerializer(serializers.Serializer):
    route_instructions = serializers.JSONField(help_text="Detailed route with legs and rest stops")
    daily_logs = serializers.JSONField(help_text="ELD-compliant daily log sheets")
    total_distance = serializers.DecimalField(max_digits=8, decimal_places=2, help_text="Total distance in miles")