FROM node:22.7.0-alpine as node

WORKDIR /

COPY package.json package-lock.json ./

RUN npm install
COPY . .
