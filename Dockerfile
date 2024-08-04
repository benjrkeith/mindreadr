# Base image
FROM node:18-alpine as backend

ENV NODE_ENV production

USER node

# Create app directory
WORKDIR /usr/src/app/backend

# Copy certs
RUN mkdir certs
COPY --chown=node:node key.base64 certs/key.base64
COPY --chown=node:node cert.base64 certs/cert.base64

# Copy .env
COPY --chown=node:node .env .env

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node backend/package*.json ./

# Install app dependencies
RUN npm ci && npm cache clean --force

# Bundle app source
COPY --chown=node:node backend/ .

# Generates the Prisma classes
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Start a new stage for building the frontend
FROM node:18-alpine as frontend

WORKDIR /usr/src/app/frontend

COPY --chown=node:node frontend/package*.json ./

RUN npm ci && npm cache clean --force

COPY --chown=node:node frontend/ .

RUN npm run build

# Start the final stage for running the app
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=backend /usr/src/app/backend .
COPY --from=frontend /usr/src/app/frontend/dist ./client

CMD [ "npm", "run", "start:prod" ]
