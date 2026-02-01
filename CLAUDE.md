# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack restaurant listing application for Bordeaux featuring a NestJS backend, Nuxt 3 frontend, PostgreSQL database, and n8n automation for Google Maps scraping.

## Commands

### Docker (Primary Development Method)
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # View backend logs
docker-compose restart backend    # Restart specific service
```

### Backend (NestJS - Port 3000)
```bash
cd backend
npm run start:dev      # Development with hot reload
npm run build          # Production build
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting
npm run typeorm        # TypeORM CLI commands
```

### Frontend (Nuxt 3 - Port 3001)
```bash
cd frontend
npm run dev            # Development server
npm run build          # Production build
npm run generate       # Static generation
```

### Setup Scripts
```bash
./install-all.sh       # Install all dependencies
./import-test-data.sh  # Import test restaurant data
./start.sh             # Start all services
```

## Architecture

```
User Browser → Frontend (Nuxt 3 :3001) → Backend API (NestJS :3000) → PostgreSQL (:5432)
                                                    ↑
                                        n8n (:5678) scraping workflow
                                        (Playwright + OpenAI → POST /scraper/import)
```

### Backend Structure (`backend/src/`)
- `main.ts` - Entry point, bootstraps NestJS app
- `app.module.ts` - Root module with TypeORM configuration
- `controllers/restaurants.controller.ts` - Public endpoints: `GET /restaurants`, `GET /restaurants/:id`
- `controllers/scraper.controller.ts` - Protected endpoint: `POST /scraper/import` (requires `x-api-key` header)
- `services/restaurants.service.ts` - Business logic, TypeORM repository operations
- `entities/restaurant.entity.ts` - TypeORM entity with UUID PK, unique constraint on (name, address)
- `dto/create-restaurant.dto.ts` - Validation with class-validator decorators
- `guards/api-key.guard.ts` - Validates API key from `API_SECRET_KEY` env var

### Frontend Structure (`frontend/`)
- `pages/index.vue` - Restaurant list with search, filters, sorting
- `pages/restaurants/[id].vue` - Restaurant detail page
- `composables/useRestaurants.ts` - API client (`getAll`, `getOne`)
- `composables/useTranslate.ts` - i18n translations (FR/EN)
- `components/LanguageSelector.vue` - Language toggle

### Database
- PostgreSQL 15 with TypeORM ORM
- `synchronize: true` in development (auto-generates schema)
- JSONB columns for arrays: `images`, `reviews`, `opening_hours`, `types`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/restaurants` | None | List all (sorted by rating DESC) |
| GET | `/restaurants/:id` | None | Get single restaurant |
| POST | `/scraper/import` | `x-api-key` header | Create/update restaurant |

## Environment Variables

Key variables in `.env`:
- `API_SECRET_KEY` - Required for `/scraper/import` endpoint
- `NUXT_PUBLIC_API_BASE` - Frontend API URL (default: `http://localhost:3000`)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD` - PostgreSQL connection

## Port Mapping
- 3000: Backend API
- 3001: Frontend
- 5432: PostgreSQL
- 5678: n8n automation
