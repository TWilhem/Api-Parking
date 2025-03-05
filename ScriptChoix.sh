#!/bin/bash

# Options du menu
options=("Void Data" "Delta Time" "Port docker:" "Cancel")
selected=()  # Tableau pour suivre les sélections
current=0    # Index de l'option actuellement surlignée
docker_port="8080"  # Variable pour stocker le port Docker sélectionné

# Initialiser les sélections à "non sélectionné"
for ((i = 0; i < ${#options[@]}; i++)); do
    selected[i]=0
done

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

        if [[ ${selected[i]} -eq 1 ]]; then
            echo -e "[X] ${options[i]}\e[0m"  # Option sélectionnée (en vert)
        else
            if [[ "$i" == 2 ]]; then
                # Afficher le port à côté de l'option "Port docker:" si un port est sélectionné
                echo -e "[X] ${options[i]} $docker_port\e[0m"
            else
                echo -e "[ ] ${options[i]}\e[0m"  # Option non sélectionnée
            fi
        fi
    done
    echo "Use ↑ ↓ to navigate, Space to select, v to validate."
}

# Fonction pour demander un port valide
ask_for_port() {
    while true; do
        read -p "Entrez un port Docker (entre 1025 et 65564) : " port
        # Vérifier que le port est un nombre et dans la plage acceptable
        if [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 1025 ] && [ "$port" -le 65564 ]; then
            docker_port=$port  # Stocker le port sélectionné
            break
        else
            echo "Port invalide. Veuillez entrer un nombre entre 1025 et 65564."
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
                "[A")
                    ((current--))
                    if [[ $current -lt 0 ]]; then current=$((${#options[@]} - 1)); fi
                    ;;
                "[B")
                    ((current++))
                    if [[ $current -ge ${#options[@]} ]]; then current=0; fi
                    ;;
            esac
            ;;
        "")
            if [[ "${options[current]}" == "Port docker:" ]]; then
                ask_for_port  # Demander un port quand l'option est sélectionnée
            elif [[ "${options[current]}" != "Cancel" ]]; then
                selected[current]=$((1 - selected[current]))
            elif [[ "${options[current]}" == "Cancel" ]]; then
                clear
                echo "Installation has been stopped. Exiting..."
                exit 0
            fi
            ;;
        'v')
            clear
            echo "You have selected:"
            for ((i = 0; i < ${#options[@]}; i++)); do
                if [[ ${selected[i]} -eq 1 ]]; then
                    echo "- ${options[i]}"
                fi
            done
            if [[ -n "$docker_port" ]]; then
                echo "- Docker Port: $docker_port"
            fi
            exit 0
            ;;
        *)
            continue
            ;;
    esac
done
