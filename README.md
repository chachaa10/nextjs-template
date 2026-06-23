# Next.js Template

A production-ready Next.js 16 template with TypeScript 6, React 19, Tailwind CSS v4, shadcn/ui, Drizzle ORM + PostgreSQL, and better-auth.

## Stack

| Category             | Technology                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Framework            | [**Next.js 16**](https://nextjs.org/docs) (App Router)                                                                   |
| UI                   | [**React 19**](https://react.dev), [**TypeScript 6**](https://www.typescriptlang.org/docs/)                              |
| Styling              | [**Tailwind CSS v4**](https://tailwindcss.com/docs) + [**shadcn/ui**](https://ui.shadcn.com/docs) (base-ui)              |
| Forms & Tables       | [**TanStack Form**](https://tanstack.com/form/latest/docs), [**TanStack Table**](https://tanstack.com/table/latest/docs) |
| Auth                 | [**better-auth**](https://www.better-auth.com/docs) (email/password)                                                     |
| Database             | **PostgreSQL 18** via Docker Compose, [**Drizzle ORM**](https://orm.drizzle.team/docs)                                   |
| Validation           | [**Zod 4**](https://zod.dev)                                                                                             |
| Icons                | [**Lucide**](https://lucide.dev)                                                                                         |
| Linting / Formatting | [**Biome 2**](https://biomejs.dev)                                                                                       |
| Testing              | [**Vitest 4**](https://vitest.dev) + **Testing Library**                                                                 |
| Package Manager      | [**Bun**](https://bun.sh/docs)                                                                                           |

## Prerequisites

- **Bun** — [install](https://bun.sh/docs/installation)
- **Docker** — for PostgreSQL via Docker Compose

## Quick Start

```bash
git clone <repo-url>
cd nextjs-template
cp .env.example .env
bun install
docker compose up -d
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `bun run dev`         | Start PostgreSQL via Docker Compose, then start Next.js dev server |
| `bun run build`       | Build for production                                               |
| `bun run start`       | Start production server                                            |
| `bun run lint`        | Check lint rules                                                   |
| `bun run lint:fix`    | Fix lint issues automatically                                      |
| `bun run format`      | Format code with Biome                                             |
| `bun run typecheck`   | Run TypeScript type checking                                       |
| `bun run test`        | Run tests with Vitest                                              |
| `bun run test:watch`  | Run tests in watch mode                                            |
| `bun run coverage`    | Run tests with coverage report                                     |
| `bun run check`       | Run `format` + `typecheck` + `lint:fix` sequentially               |
| `bun run db:generate` | Generate Drizzle migration from schema changes                     |
| `bun run db:migrate`  | Apply pending migrations                                           |
| `bun run db:push`     | Push schema directly (dev only)                                    |
| `bun run db:pull`     | Pull schema from database into code                                |
| `bun run db:studio`   | Open Drizzle Studio GUI                                            |
| `bun run db:check`    | Validate migration integrity                                       |
| `bun run db:up`       | Check for new migration options                                    |
| `bun run db:reset`    | Drop schema, re-create, and apply all migrations                   |

## Architecture

The project uses a feature-based architecture — each `features/*` folder is a self-contained module with its own UI, logic, and validation.

### Principles

- **Feature isolation** — each feature owns its components, hooks, actions, types, and validation.
- **Server components by default** — `"use client"` only where interactivity is needed.
- **Layered dependencies** — components → hooks → actions → DB, never the reverse.
- **Shared primitives** in `shared/`, app wiring in `core/`, low-level helpers in `lib/`.
- **Tests co-located** with the code they test (`.test.ts` / `.test.tsx`).

### Directory Structure

```
src/
├── app/              # Next.js App Router (routes, layouts, pages)
├── core/             # App-level logic (env config, providers)
│   ├── config/env.ts # Zod-validated environment variables
│   └── providers/    # Theme provider
├── database/               # Database
│   ├── db.ts         # Drizzle ORM client
│   ├── utils.ts      # Shared column helpers (id, timestamps)
│   └── schema/       # Table definitions (auth, todo)
├── features/         # Feature modules
│   ├── auth/         #   actions/, components/, hooks/, validation/
│   └── todo/         #   actions/, components/, validation/
├── lib/              # Low-level utilities (auth client, cn helper)
├── shared/           # Cross-feature reusable code
│   ├── components/   #   ui/ (shadcn primitives), shared UI
│   ├── hooks/        #   Shared hooks
│   └── types/        #   Shared types (Result<T>)
├── proxy.ts          # Next.js 16 middleware (route protection)
├── instrumentation.ts
└── tests/
    └── setup.ts      # Vitest setup
```

### Layer Responsibilities

| Layer        | Location                | Responsibility                  |
| ------------ | ----------------------- | ------------------------------- |
| Page         | `app/`                  | Composition, data orchestration |
| Feature      | `features/*/`           | Business logic, UI, validation  |
| Provider     | `core/providers/`       | Context wrappers (theme)        |
| UI Primitive | `shared/components/ui/` | Base UI components (shadcn)     |
| Shared UI    | `shared/components/`    | Reusable UI across features     |
| Utility      | `lib/`                  | Pure helpers, no business logic |

### Feature Folder Anatomy

Each feature can contain:

- `actions/` — Server actions with `"use server"` for data mutations and queries
- `components/` — UI components (client or server)
- `hooks/` — Custom React hooks
- `types/` — Type definitions
- `validation/` — Zod schemas for input validation
- `const/` — Test fixtures and constants

## Authentication

Two-layer route protection:

- **Middleware** — `src/proxy.ts` acts as Next.js 16 middleware, using the exported `proxy` function and `config` matcher to check `better-auth.session_token` cookie for protected routes and redirect auth pages away from authenticated users.
- **Server components** — Protected pages also call `getCurrentUser()` and redirect if no session exists (belt-and-suspenders).

Auth uses **better-auth** with email/password strategy:

- Server instance: `src/lib/auth.ts`
- Client instance: `src/lib/auth-client.ts`
- Server actions: `src/features/auth/actions/auth-actions.ts`

## Database

Drizzle ORM connects to PostgreSQL via the `DATABASE_URL` env var. Schema lives in `src/database/schema/`.

**Workflow:**

1. Edit schema files in `src/database/schema/`
2. `bun run db:generate` — creates migration SQL in `drizzle/`
3. `bun run db:migrate` — applies migration to the database

Tables: `users`, `sessions`, `accounts`, `verifications` (better-auth), `todo`.
