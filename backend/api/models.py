from django.db import models

class CrimeData(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    Neighbourhood = models.CharField(max_length=255)
    occurrencehour = models.IntegerField()
    occurrencedayofweek = models.CharField(max_length=20)
    premisetype = models.CharField(max_length=255)
    crime_type = models.CharField(max_length=255)  # Target variable (MCI)
    crime_rate = models.FloatField(default=0.0)  # Added: Estimated crime rate per 100,000 people
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Neighbourhood} - {self.crime_type} ({self.crime_rate} per 100,000) at {self.occurrencehour}:00 on {self.occurrencedayofweek}"