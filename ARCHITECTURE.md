# Architecture

This project uses a feature-based architecture to organize code in a scalable and maintainable way. The architecture is based on the following principles:

- **Feature isolation** — each `features/*` is a mini-app with its own UI, logic, data, and state.
- **Layered dependencies** — components → hooks → services → APIs, never the reverse.
- **Server components by default** — `"use client"` only when interactivity is needed.
- **Shared primitives** go in `shared/`, app wiring in `core/`, low-level helpers in `lib/`.
- **Tests** should be co-located with the code they test, following the same structure as the source code. Use `.test.ts` or `.test.tsx` suffixes.

## Overview

```
src/
├── app/          # Next.js App Router (routes, layouts, pages)
├── core/         # App-level logic (providers, config)
├── features/     # Feature modules, each self-contained
│   ├── auth/     #   components/, hooks/, services/, api/, store/, types.ts
│   ├── products/
│   ├── orders/
│   └── users/
├── lib/          # Low-level utilities (cn, etc.)
├── shared/       # Cross-feature reusable code
│   ├── components/ # Reusable UI components
│   ├── hooks/      # Reusable hooks
│   ├── utils/      # Reusable utilities
├── tests/
```

## Patterns

| Layer      | Location                | Responsibility                      |
| ---------- | ----------------------- | ----------------------------------- |
| Page/Route | `app/`                  | Composition, data orchestration     |
| Feature    | `features/*/`           | Business logic, domain types, store |
| Provider   | `core/providers/`       | Context wrappers (theme, auth)      |
| Primitive  | `shared/components/ui/` | Base UI components                  |
| Shared UI  | `shared/components/`    | Reusable UI across features         |
| Utility    | `lib/`                  | Pure helpers, no business logic     |

## Features Folder

Each feature folder should contain:

- `components/` - UI components specific to this feature
- `hooks/` - Custom hooks for this feature
- `services/` - Business logic and data fetching
- `api/` - API client and endpoints
- `store/` - State management (if needed, using Zustand)
- `validation/` - Validation logic for this feature (using Zod )
- `types.ts` - Feature-specific types

### Example Structure

This is an example structure for a feature:

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
├── api/
│   └── authApi.ts
├── store/
│   └── authStore.ts
├── validation/
│   └── authValidation.ts
└── types.ts
```

## Testing

Tests should be co-located with the code they test, following the same structure as the source code.

### Example Structure

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx
├── hooks/
│   └── useAuth.ts
│   └── useAuth.test.ts
├── services/
│   └── authService.ts
│   └── authService.test.ts
├── api/
│   └── authApi.ts
│   └── authApi.test.ts
├── store/
│   └── authStore.ts
│   └── authStore.test.ts
└── types.ts
```
