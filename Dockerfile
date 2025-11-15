# Etapa 1: construir el frontend 
FROM node:20-alpine AS builder

WORKDIR /app

# copio solo package.json y package-lock.json para aprovechar caché
COPY package*.json ./

RUN npm ci

# copio el resto del código
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: servidor Nginx para archivos estáticos
FROM nginx:alpine

# Elimino la config por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# copio la config personalizada para servir el build
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# copio los archivos generados en el build de React
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
