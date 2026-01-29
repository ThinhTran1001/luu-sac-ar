# 📘 Project Best Practices & Guidelines

**Project:** Luu Sac - Ceramic AR Platform  
**Context:** Monorepo (Next.js + Express + TypeScript)

This document outlines the architectural patterns, coding standards, and workflows adopted for this project. Adhering to these guidelines ensures scalability, maintainability, and type safety across the entire stack.

---

## 1. 🏗 Monorepo Architecture

The project is divided into `apps` (deployable) and `packages` (libraries).

```
luu-sac/
├── apps/
│   ├── api/          # Backend Express API
│   └── web/          # Frontend Next.js App
└── packages/
    └── shared/       # Shared types, DTOs, schemas, and constants
```

---

### 📦 `packages/shared` (The Single Source of Truth)

This package bridges the Frontend and Backend.

> **Rule:** Code here must be **Isomorphic** (runs on both Node.js and Browser).

#### ✅ DO:

- Define **Zod Schemas** here (used for React Hook Form validation & API Body validation)
- Export **Types/Interfaces** (DTOs)
- Define **Constants** (Enums, Configs, API Routes)
- Write **pure utility functions** (e.g., date formatting, string helpers)

#### ❌ DON'T:

- Import React components or Hooks
- Import Node.js specific modules (`fs`, `path`, database connections)

#### Example Structure:

```typescript
// packages/shared/src/schemas/auth.schema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type ILoginRequest = z.infer<typeof LoginSchema>;

// packages/shared/src/routes.ts
export const API_ROUTES = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
  },
};

// packages/shared/index.ts
export * from "./src/schemas/auth.schema";
export * from "./src/routes";
```

---

### ⚙️ `apps/api` (Backend)

Follows a **Layered Architecture** to separate concerns.

| Layer                 | Responsibility                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Controller**        | Handles HTTP requests, validates input using Shared Zod Schemas, calls Services, and sends standardized responses |
| **Service**           | Contains core business logic (calculations, AR processing, payment logic)                                         |
| **Repository/Prisma** | Direct database interactions                                                                                      |

#### Directory Structure:

```
apps/api/src/
├── constants/       # Backend-only constants (messages, config)
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── routes/          # Route definitions
├── services/        # Business logic
├── generated/       # Auto-generated files (Prisma)
└── index.ts         # App entry point
```

#### Rules:

- **Environment Variables:** Validate `process.env` variables using a library (like `envalid` or `zod`) at startup. Crash if config is missing.
- **Messages as Constants:** All user-facing messages must be defined in `constants/messages.ts`
- **Use Shared Route Constants:** Import routes from `@luu-sac/shared`

---

### 🖥️ `apps/web` (Frontend)

| Concern           | Approach                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **API Client**    | Use a centralized Axios/Fetch instance with interceptors for Token management                |
| **Data Fetching** | Do not call API clients directly in UI components. Wrap them in **React Query Custom Hooks** |
| **Type Safety**   | Directly import Interfaces/DTOs from `@luu-sac/shared`                                       |

#### Directory Structure:

```
apps/web/src/
├── app/             # Next.js App Router pages (Server Components)
├── components/      # Reusable UI components (Client Components)
├── constants/       # Frontend-only constants (routes)
├── context/         # React contexts
├── hooks/           # Custom hooks (React Query wrappers)
├── lib/             # Utilities and configurations
│   ├── api.ts       # Axios instance
│   └── schemas/     # Zod validation schemas (if FE-only)
└── services/        # API service functions
```

---

## 2. 💎 TypeScript Guidelines

### 🚫 No `any` Policy

Using `any` disables TypeScript's benefits.

```typescript
// ❌ Bad
function process(data: any) { ... }

// ✅ Good - Use unknown and perform type narrowing
function process(data: unknown) {
  if (typeof data === 'object' && data !== null) { ... }
}

// ✅ Good - Define a specific interface
function process(data: ProcessInput) { ... }
```

---

### 🛠 Use Utility Types for DTOs

Avoid code duplication when defining Database Models vs. API Payloads.

| Utility      | Use Case                                          |
| ------------ | ------------------------------------------------- |
| `Omit<T, K>` | Remove fields (e.g., exclude `id` for Create DTO) |
| `Pick<T, K>` | Select specific fields                            |
| `Partial<T>` | Make fields optional (for Update DTO)             |

```typescript
// Example
import { Product } from "@prisma/client";

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDto = Partial<CreateProductDto>;
```

---

### 🧱 String Unions > Enums

Prefer **String Literal Unions** over standard TypeScript Enums for simpler debugging and smaller bundle size.

```typescript
// ❌ Bad - Compiles to complex JS
enum Status {
  PENDING,
  ACTIVE,
}

// ✅ Good
type Status = "PENDING" | "ACTIVE";
```

---

### 🔗 Zod Inference (Single Source of Truth)

Don't write the Type and the Schema separately. **Infer the Type from the Schema.**

```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Automatically generate TypeScript interface
export type ILoginRequest = z.infer<typeof LoginSchema>;
```

---

### ⚡️ Explicit Return Types

Always define the return type for functions, especially for APIs and Hooks. This prevents accidental API contract changes.

```typescript
// ✅ Good
const getUser = (id: string): Promise<UserDto> => { ... }

// ✅ Good - React Query Hook
const useUser = (id: string): UseQueryResult<UserDto, Error> => { ... }
```

---

### 🛣 Path Aliases

Avoid relative hell (`../../../../`). Use **Path Aliases** configured in `tsconfig.json`.

```typescript
// ❌ Bad
import { LoginForm } from "../../../components/auth/LoginForm";

// ✅ Good
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginSchema } from "@luu-sac/shared";
```

---

## 3. 🚀 Next.js & React Patterns

### 🌗 Server vs. Client Components

Follow the **"Leaf Client"** pattern.

| Component Type        | Responsibility                                  | Examples              |
| --------------------- | ----------------------------------------------- | --------------------- |
| **Server Components** | SEO, Metadata, initial Data Fetching, Layout    | Pages, Layouts        |
| **Client Components** | `useState`, `useEffect`, Event Listeners, Forms | Forms, Interactive UI |

> **Note:** Keep Client Components at the "leaves" of the component tree to maximize SSR performance.

```tsx
// app/(auth)/login/page.tsx - Server Component
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="container">
      <h1>Sign In</h1>
      <LoginForm /> {/* Client Component - the "leaf" */}
    </div>
  );
}
```

---

### 📡 Data Fetching (SSR + React Query)

Combine the best of both worlds for "Product List" or "Detail" pages.

| Where      | What                                                                  |
| ---------- | --------------------------------------------------------------------- |
| **Server** | `queryClient.prefetchQuery` (Fetch data on the server)                |
| **Server** | Dehydrate state and pass to Client via `HydrationBoundary`            |
| **Client** | `useQuery` (Hydrates immediately with fresh data, no loading spinner) |

---

### 📝 Form Handling

| Aspect         | Approach                                                                              |
| -------------- | ------------------------------------------------------------------------------------- |
| **Library**    | `react-hook-form` + `@hookform/resolvers/zod`                                         |
| **Validation** | Use schemas imported from `@luu-sac/shared`                                           |
| **Benefit**    | Performance (no re-renders on keystroke) and consistent validation logic with Backend |

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, ILoginRequest } from "@luu-sac/shared";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: ILoginRequest) => {
    // call API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## 4. 🔄 API Standards

### Standard Response Format

All API endpoints must return data in a unified structure to make Frontend handling predictable.

```typescript
// Generic Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Record<string, string[]>;
}
```

#### Example Usage:

```typescript
// Controller
res.status(200).json({
  success: true,
  message: MESSAGES.AUTH.LOGIN_SUCCESS,
  data: { token, user },
});

// Error Response
res.status(400).json({
  success: false,
  message: MESSAGES.AUTH.INVALID_CREDENTIALS,
  data: null,
  errors: { email: ["Invalid email format"] },
});
```

---

## 5. 📋 Quick Reference Checklist

### Adding a New API Endpoint

1. **Shared Package:**
   - [ ] Add route constant to `packages/shared/src/routes.ts`
   - [ ] Create Zod schema in `packages/shared/src/schemas/`
   - [ ] Export from `packages/shared/index.ts`

2. **Backend (`apps/api`):**
   - [ ] Add message constants to `src/constants/messages.ts`
   - [ ] Create service method in `src/services/`
   - [ ] Create controller method in `src/controllers/`
   - [ ] Add route in `src/routes/`
   - [ ] Validate request body with Zod schema

3. **Frontend (`apps/web`):**
   - [ ] Add service method in `src/services/`
   - [ ] Create React Query hook in `src/hooks/`
   - [ ] Use in component

### Adding a New Page with Form

1. [ ] Create Zod schema in `@luu-sac/shared`
2. [ ] Create form component in `src/components/` (Client Component with `'use client'`)
3. [ ] Create page in `src/app/` (Server Component - no directive)
4. [ ] Add route constant to `src/constants/routes.ts`
5. [ ] Create service method if API call needed

---

## 6. 🏷 Naming Conventions

| Type               | Convention                            | Example                    |
| ------------------ | ------------------------------------- | -------------------------- |
| Files (components) | PascalCase                            | `LoginForm.tsx`            |
| Files (utilities)  | camelCase                             | `auth.service.ts`          |
| Files (schemas)    | kebab-case                            | `auth.schema.ts`           |
| Constants          | SCREAMING_SNAKE_CASE                  | `API_ROUTES`, `MESSAGES`   |
| Interfaces/Types   | PascalCase with `I` prefix (optional) | `ILoginRequest`, `UserDto` |
| Functions          | camelCase                             | `handleSubmit`, `login`    |
| React Hooks        | camelCase with `use` prefix           | `useAuth`, `useProducts`   |
| Zod Schemas        | PascalCase with `Schema` suffix       | `LoginSchema`              |
