"use client";

import { useRouter } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import { signUpWithFirebase } from "@/lib/auth.service";

export default function SignUpContainer() {
  const router = useRouter();

  return (
    <SignUpForm
      onSubmit={signUpWithFirebase}
      onSuccess={() => {
        router.push("/dashboard");
        router.refresh();
      }}
    />
  );
}
