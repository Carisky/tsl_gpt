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
  - `OPENAI_API_KEY=sk-...` (optional; required only if не использовать мок)
  - `ALLOWED_MODELS=gpt-4o-mini,gpt-4o,gpt-4.1-mini,o3-mini`
  - `DEFAULT_MODEL=gpt-4o-mini`
  - `MOCK_AI=true` — локальный режим без OpenAI; если ключ не задан и `NODE_ENV!==production`, мок включится автоматически
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

## Chat Endpoints (Bearer token required)
- `GET /api/chats/meta` → `{ allowedModels, defaultModel }`
- `GET /api/chats` → list user's chats
- `POST /api/chats` → create chat `{ title?, model? }`
- `GET /api/chats/:id` → chat + messages
- `POST /api/chats/:id/messages` → send message `{ content, model? }`, returns `{ message, reply }`
- `DELETE /api/chats/:id` → delete chat

Note: Prisma schema now includes `Chat` and `Message`. Create migration and update DB:
- Dev: `cd backend && npx prisma migrate dev --name add_chat`
- Or: `cd backend && npx prisma db push` (no migration history)

### Локальная разработка без OpenAI
- Поставьте `MOCK_AI=true` (или не указывайте `OPENAI_API_KEY` в dev). 
- Бэкенд сохранит сообщения как обычно и вернёт сгенерированный мок‑ответ вида «Мок-ответ (локальный режим): …». 
- Это позволяет пилить UI и логику без внешнего API.

## Frontend pages
- `/login` – Sign in form
- `/register` – Registration form
- `/dashboard` – Protected dashboard showing current user
