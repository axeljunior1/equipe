# Utilisation de Node.js comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Désactiver la télémétrie de React pour éviter des logs inutiles
ENV CHOKIDAR_USEPOLLING=true

# Commande pour lancer l'application
CMD ["npm", "start"]
