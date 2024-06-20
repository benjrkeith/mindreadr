# Base image
FROM node:18-alpine as backend

ENV NODE_ENV production

USER node

# Create app directory
WORKDIR /usr/src/app/backend

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node .env .env
COPY --chown=node:node backend/package*.json ./

# Install app dependencies
RUN npm ci --only=production && npm cache clean --force

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