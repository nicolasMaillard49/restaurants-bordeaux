#!/bin/bash
CERT_DIR="/home/deploy/restaurants-bordeaux/certbot/conf"
WEB_DIR="/home/deploy/restaurants-bordeaux/certbot/www"
EMAIL="nico39320@gmail.com"
DOMAINS="-d restaurants-bordeaux.com -d www.restaurants-bordeaux.com -d api.restaurants-bordeaux.com -d n8n.restaurants-bordeaux.com"

docker run --rm \
  -v $CERT_DIR:/etc/letsencrypt \
  -v $WEB_DIR:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  $DOMAINS \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email
