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


response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000").json()

Liste_Car = []
with open(f"./SAE-Car.txt", "a", encoding='utf8') as VALUES_Car:
    
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




response_2 = requests.get('https://portail-api-data.montpellier3m.fr/bikestation?limit=1000').json()

Liste_Velo = []
with open(f"./SAE-Bike.txt", "a", encoding='utf8') as VALUES_Bike:
    
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
