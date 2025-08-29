# TSL GPT – Full‑stack Setup

What’s included:
- Backend: Express + TypeScript + Prisma + JWT auth
- Frontend: Next.js (app router) + Redux Toolkit + redux-persist
- Database: Postgres (Docker)
- Dev via Docker Compose with live reload using bind mounts

## Prerequisites
- Docker + Docker Compose

## Quick start (Docker)
1. Build and run all services:
   - `docker-compose up --build`
2. Open frontend: `http://localhost:3000`
3. Backend API: `http://localhost:3300`

Notes:
- Code is mounted into containers, so saves reload instantly.
- Backend applies Prisma schema on boot (`migrate deploy` then `db push`).

## Environment
- Backend (`backend/.env`):
  - `PORT=3300`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tslgpt?schema=public`
  - `JWT_SECRET=...`
- Frontend (`frontend/.env.local` suggested):
  - `NEXT_PUBLIC_API_URL=http://localhost:3300`

## Prisma
- Generate client: `cd backend && npx prisma generate`
- Update DB (dev): `cd backend && npx prisma db push`
- Inspect DB: `cd backend && npx prisma studio`

## Auth Endpoints
- `POST /api/auth/register` { email, password, name? }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token)
- `PUT /api/auth/me` { name?, password? } (Bearer token)
- `DELETE /api/auth/me` (Bearer token)

## Frontend pages
- `/login` – Sign in form
- `/register` – Registration form
- `/dashboard` – Protected dashboard showing current user

