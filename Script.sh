#!/bin/bash

# Variables
GITHUB_REPO="https://github.com/TWilhem/Api-Parking"
ZIP_URL="$GITHUB_REPO/archive/refs/heads/main.zip"
LOCAL_DIR="Api-Parking"
DOCKER_IMAGE="frontend"
DOCKER_CONTAINER="Application"

# Vérifier et installer les paquets nécessaires (Docker, curl, unzip)
echo "Vérification des dépendances..."

install_package() {
    if ! command -v "$1" &> /dev/null; then
        echo "$1 n'est pas installé. Installation en cours..."
        sudo apt update && sudo apt install -y "$1"
    else
        echo "$1 est déjà installé."
    fi
}

install_package docker.io
install_package curl
install_package unzip

# Démarrer et activer Docker si nécessaire
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Redémarrer le script après ajout au groupe Docker
if ! groups | grep -q "\bdocker\b"; then
    echo "Ajout de l'utilisateur au groupe Docker. Redémarrage du script..."
    newgrp docker <<EOF
exec "$0"
EOF
    exit 0
fi

# Télécharger et extraire les fichiers sans Git
echo "Téléchargement du projet depuis GitHub..."
rm -rf "$LOCAL_DIR"
wget "$ZIP_URL" -O repo.zip
unzip repo.zip
mv Api-Parking-main "$LOCAL_DIR"
rm repo.zip
rm -rf ./Api-Parking/docs/Analyse 
rm -rf ./Api-Parking/TP
rm ./Api-Parking/Erreur.log
rm ./Api-Parking/requirements.txt

# Construire l'image Docker
echo "Construction de l'image Docker..."
docker build -t "$DOCKER_IMAGE" "$LOCAL_DIR" || { echo "Échec de la construction de l'image"; exit 1; }

# Vérifier si le conteneur existe déjà et le supprimer si nécessaire
if [ "$(docker ps -aq -f name=$DOCKER_CONTAINER)" ]; then
    echo "Arrêt et suppression de l'ancien conteneur..."
    docker stop "$DOCKER_CONTAINER" 2>/dev/null
    docker rm "$DOCKER_CONTAINER" 2>/dev/null
fi

# Lancer un nouveau conteneur
echo "Lancement du conteneur..."
docker run -d -p 8080:80 --name "$DOCKER_CONTAINER" "$DOCKER_IMAGE" || { echo "Échec du lancement du conteneur"; exit 1; }

echo "Déploiement terminé !"

