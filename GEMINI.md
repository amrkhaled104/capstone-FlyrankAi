# Project Rules 

1. **Precise Prompts Over Vague Inputs:** Always provide structured prompts with clear constraints, file references, and validation rules (e.g., using Zod) instead of relying on loose, casual instructions.
2. **Mandatory Test-Driven Verification:** Every UI component or feature must include automated unit tests (using Vitest and React Testing Library) with a verification loop to catch edge cases early.
3. **Accessibility First (a11y):** Ensure all interactive form elements implement semantic markup, proper `aria-*` attributes (`aria-invalid`, `aria-describedby`), and explicit label associations.