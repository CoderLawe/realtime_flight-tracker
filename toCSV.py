import csv
import json

csvFilePath = "aircraftDatabase-2023-03.csv"
jsonFilePath = "aiframes.json"

data = {}

with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)

    for rows in csvReader:
        key = rows['icao24']
        data[key] = rows

    with open(jsonFilePath, 'w') as jsonFile:
        jsonFile.write(json.dumps(data, indent=4))
