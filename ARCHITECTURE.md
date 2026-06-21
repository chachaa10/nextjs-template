# Architecture

```
src/
├── app/          # Next.js App Router (routes, layouts, pages)
├── core/         # App-level logic (providers, config, middleware, guards)
├── features/     # Feature modules, each self-contained
│   ├── auth/     #   components/, hooks/, services/, api/, store/, types.ts
│   ├── products/
│   ├── orders/
│   └── users/
├── lib/          # Low-level utilities (cn, etc.)
├── shared/       # Cross-feature reusable code
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
├── styles/
├── tests/
└── types/
```

## Principles

- **Feature isolation** — each `features/*` is a mini-app with its own UI, logic, data, and state.
- **Layered dependencies** — components → hooks → services → APIs, never the reverse.
- **Server components by default** — `"use client"` only when interactivity is needed.
- **Shared primitives** go in `shared/`, app wiring in `core/`, low-level helpers in `lib/`.

## Patterns

| Layer | Location | Responsibility |
|---|---|---|
| Page/Route | `app/` | Composition, data orchestration |
| Feature | `features/*/` | Business logic, domain types, store |
| Provider | `core/providers/` | Context wrappers (theme, auth) |
| Primitive | `shared/components/ui/` | Base UI components |
| Utility | `lib/` | Pure helpers, no business logic |
