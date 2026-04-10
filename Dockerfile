FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

ARG SERVICE
ENV SERVICE=$SERVICE

RUN npm run build

ENV NODE_ENV=production

CMD ["sh","-c","node dist/apps/$SERVICE/main"]
