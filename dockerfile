# Utiliser une image de base avec Python
FROM debian:latest

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    cron \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail nginx
WORKDIR /var/www/html

# Copier le projet dans le conteneur
COPY ./docs/Donnee /var/www/html/docs/Donnee
COPY ./docs/Image /var/www/html/docs/Image
COPY ./docs/Web /var/www/html/docs/Web

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier l'application Python et les dépendances
COPY main.py /var/www/html/main.py
COPY requirements.txt /var/www/html/requirements.txt

# Créer un venv python3
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt


# Donner les permissions nécessaires
RUN chmod -R 755 /var/www/html

# Exposer les ports nécessaires
EXPOSE 80

# Démarrer Nginx et garder le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
