# Stage 1: Build React Application
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Удалить node_modules, если они есть 
RUN rm -rf node_modules

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve React Application with Nginx
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]