# Utiliser une image de base avec Python
FROM python:3.11

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    nginx \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail nginx
WORKDIR /var/www/html

# Copier le projet dans le conteneur
COPY ./docs/Donnee /var/www/html/Donnee
COPY ./docs/Image /var/www/html/Image
COPY ./docs/Web /var/www/html/Web

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Donner les permissions nécessaires
RUN chmod -R 755 /var/www/html



# Copier l'application Python et les dépendances
WORKDIR /app
COPY main.py /app/main.py
COPY requirements.txt /app/requirements.txt

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Donner les permissions nécessaires à main.py
RUN chmod +x /app/main.py



# Exposer les ports nécessaires
EXPOSE 80

# Démarrer Nginx et garder le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
