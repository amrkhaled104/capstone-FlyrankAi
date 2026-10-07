'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { signInWithFirebase } from '@/lib/auth.service';

export default function LoginContainer() {
  const router = useRouter();

  return (
    <LoginForm
      onSubmit={signInWithFirebase}
      onSuccess={() => {
        router.push('/dashboard');
        router.refresh();
      }}
    />
  );
}
