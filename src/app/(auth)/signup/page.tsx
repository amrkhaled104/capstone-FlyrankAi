import { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up | HomeServices AI',
  description: 'Create an account on HomeServices AI as a customer or service technician to get started.',
};

export default function SignUpPage() {
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
        title="Create Your Account"
        subtitle="Join HomeServices AI to request services or offer your expert skills"
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
