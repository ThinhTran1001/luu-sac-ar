---
trigger: always_on
---

# 🚀 Best Practices

## TypeScript

### No `any` Policy

```typescript
// ❌ Bad
function process(data: any) { ... }

// ✅ Good - Use unknown with type narrowing
function process(data: unknown) {
  if (typeof data === 'object' && data !== null) { ... }
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
