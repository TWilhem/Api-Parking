import requests
import json
import datetime
import pytz

def Date():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%d/%m/%Y")

def Hour():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%H:%M:%S")

def log(api_name, type, response_content):
    with open(f"./{api_name}_rate_limit.log", "a", encoding='utf8') as log_file:
        if type == "Limit":
            log_file.write(f"{Date()} {Hour()} - Rate limit exceeded: {response_content}\n")
        if type == "NoAccess":
            log_file.write(f"{Date()} {Hour()} - Impossible d'accéder aux données\n")

try:

    response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000").json()

    if "message" in response and response["message"] == "API rate limit exceeded":
        log("SAE-Car", "Limit", response)
        
    Liste_Car = []
    with open(f"./SAE-Car.txt", "w", encoding='utf8') as VALUES_Car:
        
        for data in response:
            try:
                car={
                    "name": data['name']["value"],
                    "type": data['type'],
                    "allowedVehicleType": data["allowedVehicleType"]["value"],
                    "availableSpotNumber": data['availableSpotNumber']['value'],
                    "totalSpotNumber": data['totalSpotNumber']['value'],  
                    "category": data['category']["value"],
                    "longitude": [data['location']['value']['coordinates'][1]],
                    "latitude": [data['location']['value']['coordinates'][0]],
                    "requiredPermit": data['requiredPermit']['value'],
                    "status": data['status']["value"],
                    "Date": Date(),
                    "Hour": Hour(),
                }
                Liste_Car.append(car)
            except KeyError:
                continue
        NewdataCar=Liste_Car 

        VALUES_Car.writelines(json.dumps(NewdataCar, ensure_ascii=False, indent=4))

except requests.exceptions.RequestException:
    log("SAE-Car", "NoAccess")


try:

    response_2 = requests.get('https://portail-api-data.montpellier3m.fr/bikestation?limit=1000').json()

    if "message" in response_2 and response_2["message"] == "API rate limit exceeded":
        log("SAE-Bike", "Limit", response_2)

    Liste_Velo = []
    with open(f"./SAE-Bike.txt", "w", encoding='utf8') as VALUES_Bike:
        
        for data in response_2:
            try:
                bike={
                    "id": data['id'],
                    "type": data['type'],
                    "address": data['address']['value']['streetAddress'],
                    "availableBikeNumber": data["availableBikeNumber"]['value'],
                    "totalSlotNumber": data['totalSlotNumber']['value'],
                    "longitude": [data['location']['value']['coordinates'][1]],
                    "latitude": [data['location']['value']['coordinates'][0]],
                    "status": data['status']['value'],
                    "Date": Date(),
                    "Hour": Hour(),
                }
                Liste_Velo.append(bike)
            except KeyError:
                continue
        NewdataBike=Liste_Velo

        VALUES_Bike.writelines(json.dumps(NewdataBike, ensure_ascii=False, indent=4))

except requests.exceptions.RequestException:
     log("SAE-Bike", "NoAccess")
