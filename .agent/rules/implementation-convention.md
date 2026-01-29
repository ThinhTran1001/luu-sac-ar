---
trigger: always_on
---

# 🏷 Naming Conventions

## File Naming

| Type               | Convention | Example               |
| ------------------ | ---------- | --------------------- |
| Components         | PascalCase | `LoginForm.tsx`       |
| Utilities/Services | camelCase  | `auth.service.ts`     |
| Schemas            | kebab-case | `auth.schema.ts`      |
| Constants          | kebab-case | `messages.ts`         |
| DTOs               | kebab-case | `api-response.dto.ts` |

## Code Naming

| Type             | Convention                  | Example                     |
| ---------------- | --------------------------- | --------------------------- |
| Constants        | SCREAMING_SNAKE_CASE        | `API_ROUTES`, `MESSAGES`    |
| Interfaces/Types | PascalCase (optional `I`)   | `LoginDto`, `ILoginRequest` |
| Functions        | camelCase                   | `handleSubmit`, `login`     |
| React Hooks      | camelCase with `use` prefix | `useAuth`, `useProducts`    |
| Zod Schemas      | PascalCase + `Schema`       | `LoginSchema`               |

## Directory Structure

```
packages/shared/src/
├── *.dto.ts           # DTOs and interfaces
├── *.schema.ts        # Zod schemas (optional)
└── routes.ts          # API route constants

apps/api/src/
├── constants/         # Messages, config
├── controllers/       # Request handlers
├── middlewares/       # Express middlewares
├── routes/            # Route definitions
├── services/          # Business logic
├── utils/             # Helper functions
└── generated/         # Prisma generated

apps/web/src/
├── app/               # Next.js pages (Server Components)
├── components/        # UI components (Client Components)
├── constants/         # Frontend constants
├── context/           # React contexts
├── hooks/             # Custom hooks
├── lib/               # Utilities (api.ts)
└── services/          # API service functions
```
