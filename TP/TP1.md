# SAE 1.5 Donnée
## TP1 Compte rendu

--- 

### Partie 1
```py
import requests
response=requests.get("https://portail-apidata.montpellier3m.fr/offstreetparking?limit=1000")
print(response.text) 
```
Ce code utilise la librairie requests pour effectuer une requête au serveur de données (serveur web).
Il stocke la réponse à cette requête dans la variable response.
Ensuite, il affiche le contenu texte de la réponse dans la console avec print(response.text).
(Si l'on affiche uniquement la variable response dans le print, cela retournera l'état de la requête.)

### Partie 2
```py
import requests
import json
response=requests.get("https://portail-apidata.montpellier3m.fr/offstreetparking?limit=1000")
data = response.json() # Convert the response to JSON data
```
On importe la librairie JSON, puis on l'utilise pour écrire nos données dans un format JSON.
Pour ce faire, on procède de manière similaire au code précédent, mais cette fois-ci, on remplace le ".txt" par ".json()" afin qu'il ne génère pas du texte brut, mais une liste au format JSON.
Dans le cas du code présent, cette liste JSON est assignée à la variable "data", qui n'est pas utilisée par la suite. Par conséquent, rien n'est affiché dans la console.

Un fichier JSON est une liste de dictionnaires, qui peuvent eux-mêmes contenir d'autres dictionnaires ou des listes.

```py
with open('data.json', 'w') as file:
 json.dump(data, file, indent=4)
```
Ce code va ouvrir ou créer un fichier nommé "data.json" où il va insérer les données au format JSON qui ont été récupérées avec la requête dans le code précédent. (Le "indent=4" est un style d'écriture qui spécifie qu'on utilise quatre espaces pour l'indentation dans le fichier.)

```py
with open('data.json') as file:
 data = json.load(file)
print(data)
```
Ce code a pour fonction de récupérer les données stockées dans le fichier "data.json" créé précédemment, puis de les afficher au format JSON dans la console.

**2)**
```py
import requests
import json
response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000")
data = response.json()
for Voiture in data:
    if Voiture["status"]["value"] == "Open":
        with open('./TP/data.json', 'w') as file:
            json.dump(Voiture, file, indent=4)
```

**3)**
```py
import requests
import json
Liste_Car = []
response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000")
data = response.json()
with open('./TP/data.json', 'w') as file:
    for Voiture in data:
        if Voiture["status"]["value"] == "Open":
            Car = {
                "Name": Voiture["name"]["value"],
                "PlaceDispo": Voiture["availableSpotNumber"]["value"],
            }
            Liste_Car.append(Car)
    json.dump(Liste_Car, file, indent=4)
```

**4)**
```py
import requests
import json
Liste_Car = []
response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000")
data = response.json()
with open('./TP/data.json', 'w') as file:
    for Voiture in data:
        if Voiture["status"]["value"] == "Open":
            Car = {
                "Name": Voiture["name"]["value"],
                "PlaceDispo": Voiture["availableSpotNumber"]["value"],
                "PourcentagePlaceDispo": str(round((Voiture["availableSpotNumber"]["value"]/Voiture["totalSpotNumber"]["value"])*100, 2)) + "%",
            }
            Liste_Car.append(Car)
    Total = 0
    Num = 0
    for d in Liste_Car:
        Total += float(d["PourcentagePlaceDispo"].split("%")[0])
        Num += 1
    CarTotal = {
        "TotalPourcentagePlaceDispo": str(round(Total/Num, 2)) + "%"
    }
    Liste_Car.append(CarTotal)
    json.dump(Liste_Car, file, ensure_ascii=False, indent=4)
```
### Partie 3
**7)**
```py
import time
temps = int(time.time())
print(temps)
```
Ce code donne le nombre de seconde qui ce sont écoulé depuis le 1er janvier 1970

**8)**
```py
import time
import requests

Temps_Debut = int(time.time())
Duree = 300
Num = 0

while Temps_Debut + Duree >= time.time():
    Num += 1
    try :
        response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000")
    except requests.exceptions.RequestException:
        print("Error Access", Num) 
    data = response.json()
    with open('./TP/data.txt', 'a') as file:
        for Voiture in data:
            if Voiture["name"]["value"] == "Corum":
                Car = (Voiture["totalSpotNumber"]["value"] -  Voiture["availableSpotNumber"]["value"])
        file.write(f"{Car}\n")
    print("Ok", Num)
    time.sleep(10)
```

**9)**
```py
import time
import requests
import json

Temps_Debut = int(time.time())
Name = str(input("Quel est le nom du fichier des données: "))
Duree = int(input("Combien de seconde voulait vous mesurez: "))
Periodeechantillonage = int(input("Periode D'echantillonage (en seconde): "))
Num = 0

Temps_Fin = Temps_Debut + Duree

with open(f'./TP/{Name}.json', 'a', encoding='utf-8') as file:  # Le ./TP/ est juste la pour me facilité la tâche mais d'orfinaire il ne faudrait que ./{Name}
    while time.time() < Temps_Fin:
        Num += 1
        try :
            response=requests.get("https://portail-api-data.montpellier3m.fr/offstreetparking?limit=1000")
        except requests.exceptions.RequestException:
            print("Error Access", Num) 
        data = response.json()
        Liste_Car = []
        for Voiture in data:
            Car = {
                "Name": Voiture["name"]["value"],
                "PlaceDispo": Voiture["availableSpotNumber"]["value"],
                "PourcentagePlaceDispo": str(round((Voiture["availableSpotNumber"]["value"]/Voiture["totalSpotNumber"]["value"])*100, 2)) + "%",
            }
            Liste_Car.append(Car)
        json.dump(Liste_Car, file, ensure_ascii=False, indent=4)
        print("Ok", Num)
        time.sleep(Periodeechantillonage)
```
