# Dependencies
FROM node:21-alpine3.19 AS deps

# Working directory
WORKDIR /usr/src/app
# We copy the package.json package-lock.json
COPY package*.json ./
# Install node dependencies
RUN npm install


# Builder 
FROM node:21-alpine3.19 AS build


# Working directory
WORKDIR /usr/src/app

# We copy the node_modules from deps
COPY  --from=deps /usr/src/app/node_modules ./node_modules
# We copy the entire source code of the application
COPY . .
# Compile the project
RUN npm run build

#  Install dependencies production
RUN npm ci -f --only=production && npm cache clean --force



# Image
FROM node:21-alpine3.19 AS prod

# Working directory
WORKDIR /usr/src/app

# We copy the node_modules from build
COPY  --from=build /usr/src/app/node_modules ./node_modules
# We copy the folder dist from build
COPY  --from=build /usr/src/app/dist ./dist
# Copia los archivos de migración
COPY --from=build /app/src/infrastructure/persistence/migrations ./migrations

# Instala TypeORM globalmente para ejecutar migraciones
RUN npm install -g typeorm

# Enviroment 
ENV NODE_ENV=production
# User without permission
USER node
# Port expose
EXPOSE 3000

# Start the server using the production build
CMD ["sh", "-c", "typeorm migration:run && node dist/main.js"]
