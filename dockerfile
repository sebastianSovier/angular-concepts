FROM node:18.13.0 as build-app

RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app

RUN npm install --force

COPY . /app

RUN npm run build --prod


FROM nginx:1.19.2-alpine

COPY --from=build-app /app/dist/angular-concepts /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf   

EXPOSE 4200