import { describe, it, expect } from 'vitest';
import { loginSchema, signUpSchema } from '../auth.schema';

describe('auth.schema', () => {
  describe('loginSchema', () => {
    it('validates correct login credentials', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
        expect(result.data.rememberMe).toBe(true);
      }
    });

    it('defaults rememberMe to false if omitted', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rememberMe).toBe(false);
      }
    });

    it('rejects invalid email formats', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('rejects passwords shorter than 6 characters', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 6 characters');
      }
    });

    it('rejects empty fields', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    it('validates valid customer sign up data', () => {
      const validData = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePassword1',
        role: 'customer',
      };
      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates valid technician sign up data', () => {
      const validData = {
        fullName: 'Bob Smith',
        email: 'bob@technician.com',
        password: 'StrongPassword9',
        role: 'technician',
      };
      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects passwords without an uppercase letter', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain('Password must contain at least one uppercase letter');
      }
    });

    it('rejects passwords without a number', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'PasswordNoNumber',
        role: 'customer',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain('Password must contain at least one number');
      }
    });

    it('rejects invalid or missing role', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'admin',
      });
      expect(result.success).toBe(false);
    });

    it('rejects name that is too short', () => {
      const result = signUpSchema.safeParse({
        fullName: 'J',
        email: 'john@example.com',
        password: 'Password123',
        role: 'customer',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });
  });
});
