from django.db import models


class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} from {self.pickup_location} to {self.dropoff_location}"


class TripLeg(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="legs")
    sequence = models.BigIntegerField()
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance = models.DecimalField(max_digits=10, decimal_places=2)
    driving_time = models.DecimalField(max_digits=10, decimal_places=2)

    rest_stops = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ["sequence"]

    def __str__(self):
        return f"Leg {self.sequence}: {self.start_location} → {self.end_location}"


class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="daily_logs")
    day_number = models.BigIntegerField()
    log_data = models.JSONField()

    class Meta:
        ordering = ["day_number"]

    def __str__(self):
        return f"DailyLog Day {self.day_number} for Trip {self.trip.id}"
