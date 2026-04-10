<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">NestJS microservices architecture with API Gateway, RabbitMQ, and PostgreSQL.</p>

## 🚀 Overview

This repository contains a NestJS microservices monorepo with:

- `api-gateway`
- `order-service`
- `payment-service`
- `product-service`

It uses asynchronous communication via RabbitMQ and persists data with PostgreSQL + TypeORM.

## 🧰 Technologies Used

- 🟦 **TypeScript**
- 🧱 **NestJS**
- 🐰 **RabbitMQ** (message broker)
- 🐘 **PostgreSQL**
- 🗃️ **TypeORM**
- 🐳 **Docker & Docker Compose**
- ✅ **Jest** (unit/e2e tests)
- 🔍 **ESLint + Prettier**

## ⚙️ Quick Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create your environment file

```bash
cp .env.example .env
```

Windows (PowerShell):

```powershell
copy .env.example .env
```

## 🐳 Run with Docker (recommended)

```bash
docker compose up --build -d
docker compose exec api-gateway npm run migration:run
docker compose exec api-gateway npm run seed
docker compose logs -f
```

Stop everything and remove volumes:

```bash
docker compose down -v
```

## 💻 Run Locally

```bash
npm run start:dev:all
```

Run migrations and seed:

```bash
npm run migration:run
npm run seed
```

## 🧪 Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```
