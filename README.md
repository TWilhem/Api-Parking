# Api-Parking - Branche Deploiement  
## Créateur : Tom Wilhem  

---

Cette branche est dédiée au déploiement du projet **Api-Parking** à l'aide de Docker. Elle permet de configurer et de lancer rapidement l'application dans un environnement conteneurisé. Voici les étapes et les commandes nécessaires pour activer et utiliser ce dispositif.

---

## Fonctionnalités principales  
- **Déploiement automatisé** : Mise en place d'un conteneur Docker contenant l'application et ses dépendances.  
- **Configuration personnalisable** : Possibilité de définir le port Docker, le nom du conteneur, le nom de l'image, et d'autres paramètres via un script interactif.  
- **Automatisation des tâches** : Utilisation de `cron` pour exécuter des scripts Python à intervalles réguliers dans le conteneur.  
- **Serveur Nginx intégré** : Fournit une interface web pour accéder aux analyses et aux données.  

---

## Prérequis  
Avant de commencer, il est preferable d'avoir:
1. **Docker** installé sur votre machine.  
2. Les outils suivants : `curl`, `unzip`, et `wget`.  
3. Une connexion internet pour télécharger les fichiers nécessaires depuis GitHub.  

Le script se chargera de les installer si besoin.

---

## Étapes pour activer le déploiement  

### 1. Télécharger et exécuter le script  
Pour télécharger et exécuter le script, utilisez les commandes suivantes :
```bash
wget "https://raw.githubusercontent.com/TWilhem/Api-Parking/refs/heads/Deploiement/Script.sh"
chmod 644 ./Script.sh
bash ./Script.sh
```

### 2. Suivez les instructions interactives
Le script vous guidera pour :

- Configurer le port Docker.
- Définir les noms du conteneur et de l'image Docker.
- Activer ou désactiver l'automatisation des tâches avec cron sur un temps que vous definissez.

### 3. Construire et lancer le conteneur
Le script :

- Télécharge les fichiers nécessaires depuis GitHub.
- Configure Nginx avec le port spécifié.
- Construit l'image Docker et lance le conteneur.

### 4. Accéder à l'application
Une fois le conteneur lancé, ouvrez votre navigateur et accédez à l'application via :
```bash
http://localhost:<port>
```

(Remplacez ```<port>``` par le port que vous avez configuré, par exemple 8080.)

**Arrêter et supprimer le conteneur**
    
```bash
docker stop <nom_du_conteneur>
docker rm <nom_du_conteneur>
```

Recréer le conteneur
Relancez simplement le script Script.sh pour reconstruire et redéployer le conteneur.

**Structure du projet**
- nginx.conf.template : Modèle de configuration Nginx.
- dockerfile : Fichier Docker pour construire l'image.
- Script.sh : Script interactif pour configurer et déployer le projet.
- main.py : Script Python pour la collecte et l'analyse des données.
- 
**Notes**
Ce projet est conçu pour être entièrement automatisé et personnalisable.
En cas de problème, vérifiez les logs du conteneur avec :
```bash
docker logs <nom_du_conteneur>
```

**Liens utiles**
- [Documentation Docker](https://docs.docker.com/get-started/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation Python](https://docs.python.org/3/)
- [Documentation Cron](https://man7.org/en/man7/cron.7.html)
- [Documentation Wget](https://www.gnu.org/software/wget/manual/wget.html)
- [Documentation Bash](https://www.gnu.org/software/bash/manual/bash.html)

Bon déploiement !
