# Folosim imaginea oficială Node.js
FROM node:18

# Setăm directorul de lucru
WORKDIR /app

# Copiem fișierele package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele
RUN npm install

# Copiem toate fișierele în container
COPY . .

# Expunem portul utilizat de aplicație
EXPOSE 5000

# Comanda pentru a porni serverul
CMD ["npm", "start"]
