'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, getFirebaseErrorMessage } from '@/lib/firebase';
import { loginSchema, LoginFormData } from '@/lib/validators/auth.schema';

export interface LoginFormProps {
  /** Optional custom handler for integration testing or custom auth callbacks */
  onSubmit?: (data: LoginFormData) => Promise<{ error?: string } | void>;
  onSuccess?: () => void;
}

export default function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error as user types
    if (fieldErrors[name as keyof LoginFormData]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    // Validate using Zod schema
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as keyof LoginFormData;
        if (fieldName && !formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      }
      setFieldErrors(formattedErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        const res = await onSubmit(validation.data);
        if (res && res.error) {
          setGeneralError(res.error);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Configure persistence based on "rememberMe" choice
        if (typeof window !== 'undefined') {
          try {
            await setPersistence(
              auth,
              validation.data.rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
          } catch {
            // Fallback gracefully if browser storage is constrained
          }
        }

        // Firebase Auth: Sign in with email and password
        await signInWithEmailAndPassword(
          auth,
          validation.data.email,
          validation.data.password
        );
      }

      setSuccessMessage('Successfully signed in! Redirecting to your dashboard...');
      if (onSuccess) {
        onSuccess();
      }

      // Execute immediate router push and layout refresh
      router.push('/dashboard');
      router.refresh();

      // Guaranteed fallback for Next.js App Router route-group layout transitions
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            window.location.href = '/dashboard';
          }
        }, 300);
      }
    } catch (err: unknown) {
      console.error('[Firebase Auth] Sign-in error:', err);
      // Map Firebase error codes to user-friendly messages
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code) {
        setGeneralError(getFirebaseErrorMessage(firebaseError.code));
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('An unexpected authentication error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* General Alert Messages */}
      {generalError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Email Address
        </label>
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500"
          >
            <Mail className="h-4 w-4" />
          </div>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.email ? 'true' : 'false'}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            className={`w-full rounded-xl border bg-zinc-50 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800 ${
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-blue-400'
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p id="login-email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setGeneralError('Password reset link is currently handled by your administrator.');
            }}
            className="text-xs text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500"
          >
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.password ? 'true' : 'false'}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            className={`w-full rounded-xl border bg-zinc-50 py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800 ${
              fieldErrors.password
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-blue-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="login-password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Remember Me Option */}
      <div className="flex items-center pt-1">
        <input
          id="login-remember-me"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-blue-400"
        />
        <label
          htmlFor="login-remember-me"
          className="ml-2 text-sm text-zinc-600 dark:text-zinc-400 select-none cursor-pointer"
        >
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-zinc-900"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Signing In...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
}
