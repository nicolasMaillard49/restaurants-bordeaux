FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json ./
RUN npm install

# Copier le code
COPY . .

EXPOSE 3002

CMD ["npm", "start"]
