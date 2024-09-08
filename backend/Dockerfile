FROM node:22.7.0-alpine as node

WORKDIR /dist

COPY package.json package-lock.json ./

RUN npm install
COPY . .
