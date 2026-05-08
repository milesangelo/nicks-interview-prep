FROM node:22-alpine

WORKDIR /workspace
ARG NPM_STRICT_SSL=true

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm config set strict-ssl "$NPM_STRICT_SSL" \
    && npm install --omit=dev

COPY . .
