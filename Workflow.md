## What I Did

In this task, I built a simple React settings form (`SettingsForm`) in two different ways to see how AI prompt styles change the final code quality.

* **Branch 1 (`feature/settings-lazy`):** I used a very simple and short prompt: *"create setting form name and email"*.
* **Branch 2 (`feature/settings-precise`):** I used a detailed prompt with strict rules, using **Zod** for validation, accessibility attributes, and asking the AI to write unit tests with **Vitest**.

---

## Comparison

### 1. Correctness & Validation

* **Lazy Branch:** The AI made a basic form. For email validation, it only checked if the text had an `@` symbol (`includes("@")`). This means fake emails like `test@` could pass easily.
* **Precise Branch:** The AI used **Zod schema validation**. It checked that the name has at least 2 characters and the email format is 100% real and correct. It also handled loading data from `localStorage` safely.

### 2. Accessibility (a11y)

* **Lazy Branch:** The code was very basic. It used simple HTML tags and inline styles without proper labels or error connection for screen readers.
* **Precise Branch:** The AI added good accessibility features like `aria-invalid`, `aria-describedby`, `htmlFor` matching input IDs, and `role="alert"` for error messages so screen readers can read them.

### 3. Edge Cases & Testing

* **Lazy Branch:** There were **zero tests**. If something broke or if localStorage failed, we wouldn't know until running it manually.
* **Precise Branch:** The AI wrote full unit tests using **Vitest** and **React Testing Library** (`SettingsForm.test.tsx`). It tested empty inputs, wrong emails, saving data, and loading from storage. All tests passed successfully (`3 passed`).

### 4. Review Effort & Human Work

* **Lazy Branch:** It required a lot of manual work. I had to fix the weak validation, add proper styles, create error states, and write tests from scratch.
* **Precise Branch:** Because the prompt was clear and asked for a verification step, the AI delivered a production-ready component with tests on the first try. It saved me a lot of time and code review effort.

---

## One AI Mistake I Caught

In the lazy branch, the AI assumed that a simple `.includes("@")` check was enough for an email field. As a developer, I know this is a bad practice because users can type invalid emails easily. In the precise branch, using Zod fixed this mistake automatically by enforcing strict email rules.

---
