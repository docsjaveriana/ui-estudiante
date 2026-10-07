# Etapa 1: compilación de la SPA
FROM node:22-alpine AS build

WORKDIR /app

# Primero solo las dependencias: quedan en una capa propia y no se reinstalan
# mientras package-lock.json no cambie.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Configuración de producción: baseHref /estudiante/ y apiUrl relativa /api/estudiante.
# Las pruebas corren en el pipeline, no al construir la imagen.
RUN npx ng build

# Etapa 2: nginx sirviendo los archivos estáticos
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/estudiante-front/browser /usr/share/nginx/html/estudiante

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
