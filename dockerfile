# Utiliser une image de base avec Python
FROM python:latest

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    nginx \
    cron \
    build-essential \
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

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Donner les permissions nécessaires
RUN chmod -R 755 /var/www/html



# Exposer les ports nécessaires
EXPOSE 80

# Démarrer Nginx et garder le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
