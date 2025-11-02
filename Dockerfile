# Etapa 1: Build da aplicação TypeScript
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Execução da aplicação
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
RUN npm install

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
