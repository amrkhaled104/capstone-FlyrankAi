import { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log In | HomeServices AI',
  description: 'Sign in to your HomeServices AI account to manage bookings, track requests, and access our AI service advisor.',
};

export default function LoginPage() {
  return (
    <div className="relative w-full max-w-md">
      {/* Background Ambience Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-600/10" />
      </div>

      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to manage your bookings and access your AI service assistant"
        footerText="Don't have an account?"
        footerLinkText="Sign up now"
        footerLinkHref="/signup"
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
