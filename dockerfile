# Utiliser une image de base avec Python
FROM python:3.11

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    nginx \
    ruby-full \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Installer Jekyll
RUN gem install jekyll bundler
RUN gem install jekyll-sass-converter -v 3.0.0
RUN gem install jekyll-remote-theme

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier le projet dans le conteneur
COPY ./docs /var/www/html

# Construire le site Jekyll
RUN jekyll build --source /var/www/html --destination /var/www/html/_site || \
    (echo "Échec du build Jekyll" && exit 1)

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Donner les permissions nécessaires
RUN chmod -R 755 /var/www/html

# Exposer les ports nécessaires
EXPOSE 80

# Démarrer Nginx et garder le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
