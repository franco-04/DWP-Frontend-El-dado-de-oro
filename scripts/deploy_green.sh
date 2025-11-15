#!/usr/bin/env bash
set -e

APP_NAME="dado-frontend"
COLOR="green"
PORT="4002"

echo "=== Despliegue GREEN (${APP_NAME}-${COLOR}) en puerto ${PORT} ==="

docker build -t ${APP_NAME}:${COLOR} .

docker stop ${APP_NAME}-${COLOR} 2>/dev/null || true
docker rm ${APP_NAME}-${COLOR} 2>/dev/null || true

docker run -d \
  --name ${APP_NAME}-${COLOR} \
  -p ${PORT}:80 \
  ${APP_NAME}:${COLOR}

echo "Contenedor ${APP_NAME}-${COLOR} desplegado en puerto ${PORT}"
