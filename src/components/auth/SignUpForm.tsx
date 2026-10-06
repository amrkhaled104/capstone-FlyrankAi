'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Wrench, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, getFirebaseErrorMessage } from '@/lib/firebase';
import { signUpSchema, SignUpFormData, UserRole, UserProfile } from '@/lib/validators/auth.schema';

export interface SignUpFormProps {
  /** Optional custom handler for integration testing or custom auth callbacks */
  onSubmit?: (data: SignUpFormData) => Promise<{ error?: string } | void>;
  onSuccess?: () => void;
}

export default function SignUpForm({ onSubmit, onSuccess }: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name as keyof SignUpFormData]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
    if (fieldErrors.role) {
      setFieldErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    // Validate using Zod schema
    const validation = signUpSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as keyof SignUpFormData;
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
        // Firebase Auth: Create new user account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          validation.data.email,
          validation.data.password
        );

        const uid = userCredential.user.uid;

        // Update Firebase Auth user profile with Full Name
        try {
          await updateProfile(userCredential.user, {
            displayName: validation.data.fullName,
          });
        } catch {
          // Graceful fallback if display name update fails
        }

        // Save user profile data to Cloud Firestore ('users' collection)
        const userDocRef = doc(db, 'users', uid);
        const userProfileData: UserProfile = {
          uid,
          fullName: validation.data.fullName,
          email: validation.data.email,
          role: validation.data.role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userDocRef, userProfileData);
      }

      setSuccessMessage('Account created successfully! Redirecting to your dashboard...');
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
      console.error('[Firebase Auth] Sign-up error:', err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code) {
        setGeneralError(getFirebaseErrorMessage(firebaseError.code));
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('An unexpected registration error occurred. Please try again.');
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

      {/* Role Selector */}
      <fieldset className="space-y-1.5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          I want to register as
        </legend>
        <div
          role="radiogroup"
          aria-label="Account Role"
          aria-describedby={fieldErrors.role ? 'signup-role-error' : undefined}
          className="grid grid-cols-2 gap-3"
        >
          {/* Customer Option */}
          <button
            type="button"
            role="radio"
            aria-checked={formData.role === 'customer'}
            onClick={() => handleRoleSelect('customer')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              formData.role === 'customer'
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-600 dark:ring-blue-500'
                : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
            }`}
          >
            <User
              className={`h-5 w-5 mb-1.5 ${
                formData.role === 'customer' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs font-bold leading-tight">Customer</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Book services</span>
          </button>

          {/* Technician Option */}
          <button
            type="button"
            role="radio"
            aria-checked={formData.role === 'technician'}
            onClick={() => handleRoleSelect('technician')}
            disabled={isSubmitting}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              formData.role === 'technician'
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 ring-1 ring-blue-600 dark:ring-blue-500'
                : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
            }`}
          >
            <Wrench
              className={`h-5 w-5 mb-1.5 ${
                formData.role === 'technician' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs font-bold leading-tight">Technician</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Provide service</span>
          </button>
        </div>
        {fieldErrors.role && (
          <p id="signup-role-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.role}
          </p>
        )}
      </fieldset>

      {/* Full Name Input */}
      <div>
        <label
          htmlFor="signup-fullname"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Full Name
        </label>
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500"
          >
            <User className="h-4 w-4" />
          </div>
          <input
            id="signup-fullname"
            name="fullName"
            type="text"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.fullName ? 'true' : 'false'}
            aria-describedby={fieldErrors.fullName ? 'signup-fullname-error' : undefined}
            className={`w-full rounded-xl border bg-zinc-50 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800 ${
              fieldErrors.fullName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-blue-400'
            }`}
          />
        </div>
        {fieldErrors.fullName && (
          <p id="signup-fullname-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.fullName}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="signup-email"
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
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.email ? 'true' : 'false'}
            aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            className={`w-full rounded-xl border bg-zinc-50 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800 ${
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-blue-400'
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p id="signup-email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="signup-password"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500"
          >
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 8 characters with 1 number & 1 capital"
            disabled={isSubmitting}
            aria-invalid={fieldErrors.password ? 'true' : 'false'}
            aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
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
        {fieldErrors.password ? (
          <p id="signup-password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {fieldErrors.password}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 inline shrink-0 text-emerald-500" />
            <span>Must be at least 8 characters with 1 uppercase letter and 1 number.</span>
          </p>
        )}
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
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>
    </form>
  );
}
