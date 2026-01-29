---
trigger: always_on
---

# 🚀 Best Practices

## TypeScript

### No `any` Policy

```typescript
// ❌ Bad - Avoid using any or unknown when specific types can be defined
function process(data: any) { ... }

// ✅ Good - Reuse existing Interfaces/DTOs
import { LoginDto } from '@luu-sac/shared';

function process(data: LoginDto) {
  console.log(data.email);
}

// ✅ Good - Create new Interfaces if one doesn't exist (create (if need) or reusing (if possible))
interface ProcessResult {
  status: 'success' | 'failed';
  timestamp: number;
}

function getResult(): ProcessResult {
  return { status: 'success', timestamp: Date.now() };
}
```

### Zod Inference (Single Source of Truth)

```typescript
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Infer type from schema
export type LoginDto = z.infer<typeof LoginSchema>;
```

### Utility Types for DTOs

```typescript
import { Product } from "@prisma/client";

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDto = Partial<CreateProductDto>;
```

### String Unions > Enums

```typescript
// ❌ Compiles to complex JS
enum Status {
  PENDING,
  ACTIVE,
}

// ✅ Simpler, smaller bundle
type Status = "PENDING" | "ACTIVE";
```

---

## Next.js Patterns

### Server vs Client Components ("Leaf Client")

```tsx
// app/(auth)/login/page.tsx - Server Component (no directive)
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="container">
      <h1>Sign In</h1>
      <LoginForm /> {/* Client Component */}
    </div>
  );
}
```

### Form Handling

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginDto } from "@luu-sac/shared";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    /* ... */
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

## Backend Patterns

### Controller Pattern

Controllers should handle HTTP concerns only (req/res, status codes) and delegate logic to services.

```typescript
// apps/api/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { MESSAGES } from "../constants/messages";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      sendSuccess(res, result, MESSAGES.AUTH.LOGIN_SUCCESS);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      sendError(res, message, 401);
    }
  }
}
```

### Service Pattern

Services contain business logic and database interactions. They should return pure data or throw errors.

```typescript
// apps/api/src/services/auth.service.ts
import { LoginDto, AuthResponseDto } from "@luu-sac/shared";
import { MESSAGES } from "../constants/messages";

export class AuthService {
  static async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // ... validation logic

    return { token, user };
  }
}
```

---

## API Patterns

### Backend Response Helpers

```typescript
import { sendSuccess, sendError } from "../utils/response";
import { MESSAGES } from "../constants/messages";

// In controller
sendSuccess(res, data, MESSAGES.AUTH.LOGIN_SUCCESS);
sendError(res, MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
```

### Frontend Service Pattern

```typescript
import { api, extractData } from "../lib/api";
import {
  ApiResponse,
  AuthResponseDto,
  LoginDto,
  API_ROUTES,
} from "@luu-sac/shared";

export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<ApiResponse<AuthResponseDto>>(
      `${API_ROUTES.AUTH.BASE}${API_ROUTES.AUTH.LOGIN}`,
      dto,
    );
    return extractData(response);
  },
};
```

### Error Handling in Components

```typescript
const onSubmit = async (data: LoginDto) => {
  try {
    await authService.login(data);
    router.push(ROUTES.HOME);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    }
  }
};
```
