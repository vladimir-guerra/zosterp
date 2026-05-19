# 1. Usamos una versión estable de Node en su variante ligera (Alpine)
FROM node:20-alpine

# 2. Instalamos pnpm de forma global
RUN npm install -g pnpm

# 3. Nos situamos en la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 4. Copiamos los archivos de configuración de la raíz para que pnpm entienda el monorrepo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# 5. Copiamos los package.json de todas tus carpetas para aprovechar la caché de Docker
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
# Si tienes carpetas en packages/, agrégalas aquí también, por ejemplo:
COPY packages/utils/package.json ./packages/utils/

# 6. Instalamos todas las dependencias
RUN pnpm install

# 7. Copiamos el resto del código fuente del monorrepo al contenedor
COPY . .

# 8. EL COMANDO CLAVE: Arranca la aplicación usando los filtros de pnpm
# (Para el Dockerfile de la API, usa "api". Para el de la Web, usa "web")
CMD ["pnpm", "--filter", "web", "dev"]