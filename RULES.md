# 📘 Luu Sac - Project Guidelines

**Project:** Luu Sac - Ceramic AR Platform  
**Stack:** Next.js + Express + TypeScript (Monorepo)

## Documentation

| Document                                      | Description                                |
| --------------------------------------------- | ------------------------------------------ |
| [CONVENTIONS.md](./docs/CONVENTIONS.md)       | Naming conventions and directory structure |
| [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) | Code patterns and examples                 |
| [RULES.md](./docs/RULES.md)                   | Strict rules and checklists                |
| [PRODUCT-CREATE-API.md](./docs/PRODUCT-CREATE-API.md) | API tạo product + AR 3D (cho Web Agent)   |

## Quick Start

```bash
# Install dependencies
npm install

# Run development
npm run dev
```

## Architecture Overview

```
luu-sac/
├── apps/
│   ├── api/          # Express Backend
│   └── web/          # Next.js Frontend
└── packages/
    └── shared/       # Shared DTOs, schemas, constants
```

## Key Principles

1. **Single Source of Truth** - Zod schemas in `@luu-sac/shared`
2. **Type Safety** - No `any`, use `unknown` with type guards
3. **Consistent API** - All endpoints return `ApiResponse<T>`
4. **Server-First** - Pages are Server Components, forms are Client
5. **Centralized Constants** - Messages, routes in constants files
