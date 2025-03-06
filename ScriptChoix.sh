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
    read -p "Entrez un nouvel intervalle pour Delta Time (ex: 10m, 1h, 30s, disable) : " new_crontab
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

