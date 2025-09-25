from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Trip from {self.current_location} to {self.dropoff_location}"

class TripLeg(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='legs')
    sequence = models.IntegerField()
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance = models.DecimalField(max_digits=8, decimal_places=2)
    driving_time = models.DecimalField(max_digits=5, decimal_places=2)
    rest_stops = models.JSONField(default=list)
    
    class Meta:
        ordering = ['sequence']

class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='daily_logs')
    day_number = models.IntegerField()
    log_data = models.JSONField()
    
    class Meta:
        ordering = ['day_number']