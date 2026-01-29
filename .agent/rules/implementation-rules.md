---
trigger: always_on
---

# 📜 Project Rules

## Shared Package (`@luu-sac/shared`)

| ✅ DO                     | ❌ DON'T                   |
| ------------------------- | -------------------------- |
| Zod Schemas               | React components/hooks     |
| DTOs/Interfaces           | Node.js modules (fs, path) |
| Constants (routes, enums) | Database connections       |
| Pure utility functions    | Side effects               |

---

## Backend Rules (`apps/api`)

1. **All messages must be constants** in `constants/messages.ts`
2. **Use shared route constants** from `@luu-sac/shared`
3. **All endpoints return `ApiResponse<T>`** using response helpers
4. **Layered architecture**: Controller → Service → Repository
5. **Validate env vars at startup** (crash if missing)

---

## Frontend Rules (`apps/web`)

1. **Pages are Server Components** (no `'use client'`)
2. **Forms/interactivity are Client Components** (with `'use client'`)
3. **Use `react-hook-form` + `zod`** for all forms
4. **Import schemas from `@luu-sac/shared`**
5. **Use `authService`/services for API calls** (not direct fetch)
6. **Use route constants** for navigation

---

## API Standards

### Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page; limit; total; totalPages };
  errors?: Record<string, string[]>;
}
```

### Backend

- Use `sendSuccess(res, data, message)` and `sendError(res, message, code)`
- Messages from `MESSAGES` constants

### Frontend

- Services use `extractData(response)` helper
- Interceptor converts API errors to `Error` objects

---

## Checklist: Adding New Endpoint

1. **Shared**: Add route to `routes.ts`, create Zod schema
2. **Backend**: Add message constant, service, controller, route
3. **Frontend**: Add service method, use in component

## Checklist: Adding New Page with Form

1. Create Zod schema in `@luu-sac/shared`
2. Create form component (Client) in `components/`
3. Create page (Server) in `app/`
4. Add route constant, create service if needed
