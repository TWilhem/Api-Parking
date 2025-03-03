import requests
import json
import datetime
import pytz
import os

def Date():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%d/%m/%Y")

def File():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%m-%Y")

def Hour():
    paris_tz = pytz.timezone('Europe/Paris')
    now = datetime.datetime.now(paris_tz)
    return now.strftime("%H:%M:%S")


AttentionE = []


def log(Erreurlog, api_name, type, response_content=""):
    if Erreurlog == "Erreur.log":
        with open(f"./{Erreurlog}", "a", encoding='utf8') as log_file:
            if type == "Limit":
                log_file.write(f"{Date()} {Hour()} - {response_content} {api_name}\n")
                return
            if type == "NoAccess":
                log_file.write(f"{Date()} {Hour()} - Impossible d'accéder aux donnees {api_name.replace('SAE-', '')}\n")
                return
    if Erreurlog == "Attention.json":
        if type == "PrData":
            Attention.update(response_content)

def load_existing_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf8') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    else:
        with open(filename, 'w', encoding='utf8') as file:
            json.dump([], file)
        return []

def save_data(filename, data):
    with open(filename, 'w', encoding='utf8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

try:
    response = requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000").json()

    if "message" in response:
        log("Erreur.log", f"SAE-Car-{File()}", "Limit", response)
        
    else:    
        Liste_Car = load_existing_data(f"./docs/Donnee/SAE-Car-{File()}.json")
        for data in response:
            try:
                car = {
                    "name": data['name']["value"],
                    "type": data['type'],
                    "availableSpotNumber": data['availableSpotNumber']['value'],
                    "totalSpotNumber": data['totalSpotNumber']['value'],  
                    "longitude": data['location']['value']['coordinates'][1],
                    "latitude": data['location']['value']['coordinates'][0],
                    "status": data['status']["value"],
                    "Date": Date(),
                    "Hour": Hour(),
                }
                Liste_Car.append(car)
                if data['totalSpotNumber']['value'] == 0:
                    AttentionE.append(f"{data['name']['value']} erreur totalSpotNumber == 0")
                elif (data['availableSpotNumber']['value']/data['totalSpotNumber']['value'])*100 <= 10:
                    AttentionE.append(f"{data['name']['value']} less than 10%")
            except KeyError:
                continue

        save_data(f"./docs/Donnee/SAE-Car-{File()}.json", Liste_Car)

except requests.exceptions.RequestException:
    log("Erreur.log", f"SAE-Car-{File()}", "NoAccess")

try:
    response_2 = requests.get('https://portail-api-data.montpellier3m.fr/bikestation?limit=1000').json()

    if "message" in response_2:
        log("Erreur.log", f"SAE-Bike-{File()}", "Limit", response_2)

    else:
        Liste_Velo = load_existing_data(f"./docs/Donnee/SAE-Bike-{File()}.json")
        for data in response_2:
            try:
                bike = {
                    "id": data['id'],
                    "type": data['type'],
                    "address": data['address']['value']['streetAddress'],
                    "availableBikeNumber": data["availableBikeNumber"]['value'],
                    "totalSlotNumber": data['totalSlotNumber']['value'],
                    "longitude": data['location']['value']['coordinates'][1],
                    "latitude": data['location']['value']['coordinates'][0],
                    "status": data['status']['value'],
                    "Date": Date(),
                    "Hour": Hour(),
                }
                Liste_Velo.append(bike)
                if (data['availableBikeNumber']['value']/data['totalSlotNumber']['value'])*100 <= 20:
                    AttentionE.append(f"{data['id'].split(':')[-2]+':'+data['id'].split(':')[-1]} less than 10%")
            except KeyError:
                continue

        save_data(f"./docs/Donnee/SAE-Bike-{File()}.json", Liste_Velo)

except requests.exceptions.RequestException:
    log("Erreur.log", f"SAE-Bike-{File()}", "NoAccess")



Liste_Attention = load_existing_data(f"./docs/Donnee/Attention.json")

Attention = {
    "Date": f"{Date()} {Hour()}",
    "Erreur": AttentionE
}

Liste_Attention.append(Attention)

save_data(f"./docs/Donnee/Attention.json", Liste_Attention)