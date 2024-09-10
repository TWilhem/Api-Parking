import requests
import json
import datetime
import pytz
import os

def Date():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%d/%m/%Y")

def Hour():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%H:%M:%S")

def log(api_name, type, response_content=""):
    with open(f"./Erreur.log", "a", encoding='utf8') as log_file:
        if type == "Limit":
            log_file.write(f"{Date()} {Hour()} - {response_content} {api_name}\n")
            return
        if type == "NoAccess":
            log_file.write(f"{Date()} {Hour()} - Impossible d'accéder aux données {api_name.replace('SAE-', '')}\n")
            return

def load_existing_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf8') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    else:
        return []

def save_data(filename, data):
    with open(filename, 'a', encoding='utf8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

try:
    response = requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000").json()

    if "message" in response:
        log("SAE-Car", "Limit", response)
        
    else:    
        Liste_Car = load_existing_data("./SAE-Car.json")
        for data in response:
            try:
                car = {
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

        save_data("./docs/SAE-Car.json", Liste_Car)

except requests.exceptions.RequestException:
    log("SAE-Car", "NoAccess")

try:
    response_2 = requests.get('https://portail-api-data.montpellier3m.fr/bikestation?limit=1000').json()

    if "message" in response_2:
        log("SAE-Bike", "Limit", response_2)

    else:
        Liste_Velo = load_existing_data("./SAE-Bike.json")
        for data in response_2:
            try:
                bike = {
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

        save_data("./docs/SAE-Bike.json", Liste_Velo)

except requests.exceptions.RequestException:
    log("SAE-Bike", "NoAccess")
