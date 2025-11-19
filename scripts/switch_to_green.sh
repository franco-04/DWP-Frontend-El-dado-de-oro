#!/usr/bin/env bash
set -e

echo "=== Cambiando tráfico a GREEN ==="

sudo rm -f /etc/nginx/conf.d/dado-active.conf
sudo ln -s /etc/nginx/conf.d/dado-green.conf /etc/nginx/conf.d/dado-active.conf

sudo nginx -t
sudo systemctl reload nginx

echo "Tráfico apuntando a GREEN (127.0.0.1:4002)"
