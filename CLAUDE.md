# FlyrankAi Frontend - Developer Guide (CLAUDE.md)

This document outlines the architecture, development commands, code style, and clean code conventions for the **FlyrankAi** React and Tailwind CSS frontend capstone project.

---

## 1. Development & Build Commands

Always use the package manager specified below (`npm` is the default).

### Environment Setup
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (runs Vite dev server)
- **Production Build:** `npm run build`
- **Preview Production Build:** `npm run preview`

### Quality Assurance
- **Type Checking:** `npm run type-check` (runs `tsc --noEmit`)
- **Linting:** `npm run lint` or `npm run lint:fix` (runs ESLint)
- **Code Formatting:** `npm run format` (runs Prettier)
- **Unit Testing:** `npm run test` (runs Vitest / Jest)
- **Test Coverage:** `npm run test:coverage`

---

## 2. Technical Stack

*   **Framework:** React 18+ (TypeScript)
*   **Build Tool:** Vite (for fast, modern development)
*   **Styling:** Tailwind CSS (utility-first CSS) + Headless UI / Radix UI (for accessible primitives)
*   **State Management:**
    *   *Global:* Zustand (lightweight, hook-based) or Redux Toolkit (if complex/enterprise state)
    *   *Server/Cache:* TanStack Query (React Query)
    *   *Local:* React `useState` / `useReducer`
*   **Routing:** React Router v6
*   **Forms & Validation:** React Hook Form + Zod
*   **Testing:** Vitest + React Testing Library

---

## 3. Directory Structure

Adopt a feature-based, modular structure to ensure maintainability and high scalability:

```text
src/
├── assets/          # Static files (images, icons, global web fonts)
├── components/      # Shared/Global reusable UI components
│   ├── ui/          # Low-level primitive design system elements (Button, Input, Modal)
│   └── layout/      # Shared layout components (Navbar, Sidebar, Footer)
├── context/         # Global React Context providers (e.g., Theme, Auth)
├── features/        # Feature-based modular directories
│   ├── dashboard/   # Example feature: Dashboard
│   │   ├── components/  # Feature-specific UI components
│   │   ├── hooks/       # Feature-specific hooks
│   │   ├── services/    # Feature-specific API calls
│   │   ├── store/       # Feature-specific Zustand store (if needed)
│   │   └── index.ts     # Public entry point for the feature
│   └── ranking/     # Example feature: Ranking/Leaderboard
├── hooks/           # Shared/Global custom React hooks (e.g., useAuth, useDebounce)
├── lib/             # Third-party library initializations (e.g., axios client, supabase)
├── routes/          # Route definitions and page-level route components
├── services/        # Shared global API/network service clients
├── types/           # Shared global TypeScript type/interface definitions
├── utils/           # Shared global utility helper functions (e.g., date formatting, cn helper)
├── App.tsx          # Application root component
├── index.css        # Global CSS (Tailwind directives)
└── main.tsx         # Application entry point
```

---

## 4. Code Style & Conventions

### General Guidelines
*   **TypeScript:** Strict mode enabled. Avoid `any` at all costs. Prefer interfaces over types for public APIs or objects that might be extended.
*   **File Naming:**
    *   `Kebab-case` for directories (e.g., `user-profile/`).
    *   `PascalCase` for React Component files and directories containing them (e.g., `Button.tsx`, `UserProfileCard.tsx`).
    *   `camelCase` for hooks, utility files, types, and helper scripts (e.g., `useLocalStorage.ts`, `formatDate.ts`).
*   **Component Structure:**
    *   Use functional components with explicit `React.FC<Props>` or standard parameter destructuring with types.
    *   Keep components small, single-purpose (SRP - Single Responsibility Principle). If a component exceeds 150-200 lines, extract sub-components or move state logic to custom hooks.
    *   Export components as default or named exports consistently (prefer named exports to support better IDE auto-imports).

### React & TypeScript Code Example
```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Use a utility function like clsx/tailwind-merge (often aliased as 'cn') for combining classes
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200';
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2 border-2 border-current border-t-transparent rounded-full h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
};
```

---

## 5. Tailwind CSS & Styling Conventions

To maintain readability and clean Tailwind classes across the codebase:

1.  **Logical Ordering of Tailwind Utility Classes:**
    Follow a consistent order for utility classes (or use the Prettier Tailwind plugin):
    *   *Layout:* `position` (absolute, relative), `display` (flex, grid), `box-model` (w, h, p, m, z-index).
    *   *Typography:* `font-size`, `font-weight`, `text-color`, `text-align`.
    *   *Visuals:* `bg-color`, `border`, `rounded`, `shadow`, `opacity`.
    *   *Interactive/States:* `hover:`, `focus:`, `active:`, `disabled:`.
    *   *Responsive:* `sm:`, `md:`, `lg:`, `xl:`.

2.  **Conditional Styling (The `cn` Utility):**
    Never do manual, fragile string concatenation for complex styles. Use a utility function that combines `clsx` and `tailwind-merge` to resolve styling conflicts dynamically:
    ```typescript
    import { clsx, type ClassValue } from 'clsx';
    import { twMerge } from 'tailwind-merge';

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    ```
    *Usage:*
    ```tsx
    <div className={cn('p-4 rounded-lg', isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800')} />
    ```

3.  **Tailwind Config Customization:**
    Keep style token extensions (colors, fonts, shadow presets) contained in `tailwind.config.js`. Do not hardcode arbitrary custom hex codes like `bg-[#1a2b3c]` in multiple files unless it is an isolated one-off case. Define custom theme values:
    ```javascript
    // tailwind.config.js
    module.exports = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f5f7ff',
              500: '#3b82f6',
              900: '#1e3a8a',
            }
          }
        }
      }
    }
    ```

---

## 6. Clean Code & Architecture Rules

*   **DRY (Don't Repeat Yourself):** Extract reusable UI components into `components/ui` or local feature components.
*   **Separation of Concerns:** Keep presentation and logic separate. Use custom hooks (`useFeatureName.ts`) to manage complex state transitions, API queries, or form validation, keeping the component markup clean and descriptive.
*   **Accessibility (a11y):**
    *   Ensure proper semantic HTML tag selection (`<main>`, `<header>`, `<nav>`, `<button>`, `<section>`).
    *   Provide `aria-` labels and attributes for interactive elements when their purpose isn't clear to screen readers.
    *   Support full keyboard navigation for critical UI flows (modals, dropdowns).
*   **API Client Design:**
    *   Define API calls in dedicated service files using Axios or Fetch wrapper.
    *   Handle base URLs, authorization headers, and error interceptors globally in `src/lib/axios.ts` or `src/services/api.ts`.
    *   Always write types for requests and responses.
*   **Error Handling & Fallbacks:**
    *   Utilize React Error Boundaries at key routing points or root levels.
    *   Include skeleton loading states and empty state layouts for an optimal user experience.
