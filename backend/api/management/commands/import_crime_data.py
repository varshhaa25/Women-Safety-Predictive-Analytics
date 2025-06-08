import csv
from django.core.management.base import BaseCommand
from api.models import CrimeData  # Replace `your_app` with your Django app name

class Command(BaseCommand):
    help = 'Import crime data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']

        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            crime_objects = []

            for row in reader:
                crime = CrimeData(
                    latitude=float(row["latitude"]),
                    longitude=float(row["longitude"]),
                    Neighbourhood=row["Neighbourhood"],
                    occurrencehour=int(row["occurrencehour"]),
                    occurrencedayofweek=row["occurrencedayofweek"],
                    premisetype=row["premisetype"]
                )
                crime_objects.append(crime)

            # Bulk insert
            CrimeData.objects.bulk_create(crime_objects)

        self.stdout.write(self.style.SUCCESS("CSV data imported successfully!"))
