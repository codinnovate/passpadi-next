"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import Logo from "@/components/Logo";
import GoogleSignInButton from "@/modules/auth/ui/GoogleSignInButton";
import OrDivider from "@/modules/auth/ui/OrDivider";
import RegisterForm from "@/modules/auth/ui/RegisterForm";
import AuthErrorFallback from "@/modules/auth/ui/AuthErrorFallback";
import AuthFormSkeleton from "@/modules/auth/ui/AuthFormSkeleton";

export default function RegisterView() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Logo className="w-[120px]" />
        <h1 className="text-xl font-bold text-[#030229]">
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Start preparing for your exams today
        </p>
      </div>

      <ErrorBoundary FallbackComponent={AuthErrorFallback}>
        <Suspense fallback={<AuthFormSkeleton />}>
          <GoogleSignInButton />
          <OrDivider />
          <RegisterForm />
        </Suspense>
      </ErrorBoundary>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-purple hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
