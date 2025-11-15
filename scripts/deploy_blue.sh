#!/usr/bin/env bash
set -e

APP_NAME="dado-frontend"
COLOR="blue"
PORT="4001"

echo "=== Despliegue BLUE (${APP_NAME}-${COLOR}) en puerto ${PORT} ==="

# 1. Construir imagen
docker build -t ${APP_NAME}:${COLOR} .

# 2. Detener y eliminar contenedor anterior (si existe)
docker stop ${APP_NAME}-${COLOR} 2>/dev/null || true
docker rm ${APP_NAME}-${COLOR} 2>/dev/null || true

# 3. Levantar contenedor BLUE en puerto 4001
docker run -d \
  --name ${APP_NAME}-${COLOR} \
  -p ${PORT}:80 \
  ${APP_NAME}:${COLOR}

echo "Contenedor ${APP_NAME}-${COLOR} desplegado en puerto ${PORT}"
