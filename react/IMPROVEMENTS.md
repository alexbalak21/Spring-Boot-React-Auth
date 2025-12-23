# Improvements & Refactoring Plan

This document outlines a clear, professional roadmap to improve the React application.
The goal is to make the codebase **modular, maintainable, scalable, and production-ready**.

---

## 1. Adopt a Feature-Based Architecture

### Current Issue
- Code is organized by type (components, hooks, context)
- Features are spread across folders
- Hard to scale and reason about ownership

### Improvement
Adopt a **feature-first** structure where each feature owns its logic, UI, hooks, and types.

```
src/
├── app/
│   ├── App.tsx
│   ├── Providers.tsx
│   ├── routes.tsx
│   └── index.ts
│
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   ├── auth.api.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── UserContext.tsx
│   │   ├── UserMenu.tsx
│   │   ├── ProfileImageUploader.tsx
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── EditableText.tsx
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useCsrf.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── apiClient.ts
│   │   └── storage.ts
│
├── styles/
│   └── main.css
│
└── main.tsx
```

---

## 2. Make `App.tsx` Minimal and Boring

### Problem
- App.tsx risks becoming a “god file”
- Too many responsibilities in one place

### Improvement
Move providers, routes, and layout logic out of `App.tsx`.

```tsx
export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}
```

---

## 3. Separate UI Components from Business Logic

### UI Components (`shared/components`)
Rules:
- No API calls
- No context usage
- Props only
- Fully reusable

### Feature Components (`features/*`)
- Can use hooks, context, and API
- Implement business rules

This separation improves reusability, testability, and clarity.

---

## 4. Improve Context Usage

### Problems
- Contexts can grow too large
- Unnecessary re-renders
- Raw contexts may be exported

### Improvements
- Never export raw context
- Expose a custom hook (`useAuth`, `useUser`)
- Keep context state minimal
- Split data and actions

```ts
type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  login(token: string): void
  logout(): void
}
```

---

## 5. Centralize API Logic

### Problem
- `fetch` logic scattered across components and hooks

### Improvement
Create a single API client and feature-specific API files.

```ts
// shared/lib/apiClient.ts
export const apiClient = {
  get: (url: string) => fetch(url, { credentials: "include" }),
  post: (url: string, body: unknown) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }),
}
```

```ts
// features/auth/auth.api.ts
export const login = (payload: LoginPayload) =>
  apiClient.post("/api/login", payload)
```

---

## 6. Treat Types as First-Class Citizens

### Improvements
- Centralize types per feature
- Avoid inline interfaces inside components
- Avoid `any`
- Import types explicitly

```ts
import type { User } from "./user.types"
```

---

## 7. Naming, Cleanup, and Consistency

### Improvements
- Use consistent, descriptive names
- Rename components to reflect responsibility
- Delete dead or legacy files

Examples:
- `UploadProfileImage` → `ProfileImageUploader`
- `EditableField` → `EditableText`
- Remove `NavbarOld.tsx`

Dead code increases cognitive load and should be removed.

---

## 8. Use Index Files for Clean Imports

Create `index.ts` files inside feature folders:

```ts
export * from "./UserMenu"
export * from "./UserContext"
```

Allows clean imports:

```ts
import { UserMenu } from "@/features/user"
```

---

## 9. Tooling & Professional Polish

Recommended additions:
- ESLint (strict rules)
- Prettier (consistent formatting)
- Absolute imports (`@/`)
- Error boundaries
- Centralized toast/notification system

---

## 10. Optional Next-Level Improvements

- Introduce React Query / TanStack Query
- Add unit and integration tests
- Add loading & error states consistently
- Add role-based access control if needed

---

## Summary

After applying these improvements, the application will:
- Be easier to scale
- Be easier to onboard new developers
- Have clearer ownership of logic
- Look professional and production-ready

This plan can be implemented incrementally over multiple commits.
