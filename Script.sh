#!/bin/bash

# Options du menu
options=("Void Data" "Delta Time" "Port docker:" "Cancel")
selected=(0 0 0 0)  # Tableau pour suivre les sélections
current=0    # Index de l'option actuellement surlignée
Crontab="15m"
docker_port="8080"  # Variable pour stocker le port Docker sélectionné

# Fonction pour afficher le menu
draw_menu() {
    clear
    echo "=== Selection Menu ==="
    for ((i = 0; i < ${#options[@]}; i++)); do
        if [[ $i -eq $current ]]; then
            echo -ne "\e[1;33m> "  # Flèche jaune indiquant la ligne sélectionnée
        else
            echo -ne "  "
        fi

        case "$i" in
            1) 
                if [[ "$Crontab" != "disable" ]]; then
                    echo -e "[X] ${options[i]} ($Crontab)\e[0m"  # Delta Time activé avec valeur
                else
                    echo -e "[ ] ${options[i]}\e[0m"  # Delta Time désactivé
                fi
                ;;
            2) echo -e "[X] ${options[i]} $docker_port\e[0m" ;; # Port Docker avec valeur affichée
            3) echo -e "[ ] ${options[i]}\e[0m" ;;  # Cancel toujours non sélectionnable
            *)
                if [[ ${selected[i]} -eq 1 ]]; then
                    echo -e "[X] ${options[i]}\e[0m"  # Option sélectionnée
                else
                    echo -e "[ ] ${options[i]}\e[0m"  # Option non sélectionnée
                fi
                ;;
        esac
    done
    echo "Use ↑ ↓ to navigate, Space to select, v to validate."
}

# Fonction pour demander une valeur de Delta Time
ask_for_crontab() {
    read -p "Entrez un nouvel intervalle pour Delta Time (ex: 10m, 1h, 1d, disable) : " new_crontab
    Crontab="$new_crontab"
}

# Fonction pour demander un port valide
ask_for_port() {
    while true; do
        read -p "Entrez un port Docker (entre 1024 et 65535) : " port
        if [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 1024 ] && [ "$port" -le 65535 ]; then
            docker_port=$port
            break
        else
            echo "Port invalide. Veuillez entrer un nombre entre 1024 et 65535."
        fi
    done
}

# Fonction pour configurer la crontab dans le conteneur
setup_cron_in_docker() {
    # Si Crontab est activé, on configure le cron
    if [[ "$Crontab" != "disable" ]]; then
        echo "Configuration de Cron pour exécuter le script toutes les $Crontab..."

        # Convertir Crontab en format de cron standard
        case "$Crontab" in
            *m) cron_interval="*/${Crontab%m} * * * *" ;; # Toutes les X minutes
            *h) cron_interval="* */${Crontab%h} * * *" ;; # Toutes les X heures
            *d) cron_interval="* * */${Crontab%d} * *" ;; # Tous les X jours
            *) echo "Format Cron invalide"; exit 1 ;;
        esac

        # Ajouter le cron dans le conteneur Docker
        docker exec "$DOCKER_CONTAINER" bash -c "echo '$cron_interval root /usr/local/bin/your-script.sh >> /var/log/cron.log 2>&1' > /etc/cron.d/your-crontab"
        
        # Appliquer la crontab
        docker exec "$DOCKER_CONTAINER" bash -c "chmod 0644 /etc/cron.d/your-crontab && crontab /etc/cron.d/your-crontab"
        
        # Redémarrer cron pour appliquer les changements
        docker exec "$DOCKER_CONTAINER" bash -c "service cron restart"
    else
        # Si Crontab est désactivé, on supprime le fichier crontab
        docker exec "$DOCKER_CONTAINER" bash -c "rm -f /etc/cron.d/your-crontab"
        echo "Cron désactivé."
    fi
}

# Fonction principale pour gérer les entrées clavier
while true; do
    draw_menu
    read -s -n 1 key  # Lire une seule touche (sans affichage)

    case "$key" in
        $'\x1b')
            read -s -n 2 key
            case "$key" in
                "[A") ((current--)); [[ $current -lt 0 ]] && current=$((${#options[@]} - 1)) ;;
                "[B") ((current++)); [[ $current -ge ${#options[@]} ]] && current=0 ;;
            esac
            ;;
        "")
            case "${options[current]}" in
                "Port docker:") ask_for_port ;;
                "Delta Time") ask_for_crontab ;;
                "Cancel")
                    clear
                    echo "Installation has been stopped. Exiting..."
                    exit 0
                    ;;
                *)
                    selected[current]=$((1 - selected[current]))
                    ;;
            esac
            ;;
        'v')
            clear
            echo "You have selected:"
            for ((i = 0; i < ${#options[@]}; i++)); do
                if [[ ${selected[i]} -eq 1 ]]; then
                    echo "- ${options[i]}"
                fi
            done
            echo "- Delta Time: $Crontab"
            echo "- Docker Port: $docker_port"
            break
            ;;
    esac
done

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
if [[ ${selected[0]} -eq 1 ]]; then
    rm -rf ./Api-Parking/Donnee
fi

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
docker run -d -p $docker_port:80 --name "$DOCKER_CONTAINER" "$DOCKER_IMAGE" || { echo "Échec du lancement du conteneur"; exit 1; }

# Configurer le cron dans le conteneur Docker
setup_cron_in_docker

echo "Déploiement terminé !"