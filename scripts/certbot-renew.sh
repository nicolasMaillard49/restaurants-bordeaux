#!/bin/bash
# Renouvellement automatique des certificats SSL
# Ajouter au crontab : 0 3 * * 1 /home/deploy/restaurants-bordeaux/scripts/certbot-renew.sh

CERT_DIR="/home/deploy/restaurants-bordeaux/certbot/conf"
WEB_DIR="/home/deploy/restaurants-bordeaux/certbot/www"

docker run --rm \
  -v $CERT_DIR:/etc/letsencrypt \
  -v $WEB_DIR:/var/www/certbot \
  certbot/certbot renew --quiet

# Recharger Nginx pour prendre les nouveaux certs
docker exec prod-restaurants-nginx nginx -s reload
