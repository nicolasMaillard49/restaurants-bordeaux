FROM n8nio/n8n:latest

USER root

# Installation des dépendances système pour Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Installation de Playwright
RUN npm install -g playwright@1.40.0
RUN npx playwright install chromium --with-deps

# Variables d'environnement pour Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/lib/chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

USER node