FROM node:16.10.0 as build-app

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run build --prod


FROM nginx:1.17.1-alpine

COPY --from=build-app /app/dist/angular-concepts /usr/share/nginx/html