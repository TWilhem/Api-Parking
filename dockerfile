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

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer les ports nécessaires
EXPOSE 80

# Démarrer Nginx et garder le conteneur actif
CMD ["nginx", "-g", "daemon off;"]
