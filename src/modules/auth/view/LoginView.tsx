"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import Logo from "@/components/Logo";
import GoogleSignInButton from "@/modules/auth/ui/GoogleSignInButton";
import OrDivider from "@/modules/auth/ui/OrDivider";
import LoginForm from "@/modules/auth/ui/LoginForm";
import AuthErrorFallback from "@/modules/auth/ui/AuthErrorFallback";
import AuthFormSkeleton from "@/modules/auth/ui/AuthFormSkeleton";

export default function LoginView() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Logo className="w-[120px]" />
        <h1 className="text-xl font-bold text-[#030229]">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          Sign in to continue your prep
        </p>
      </div>

      <ErrorBoundary FallbackComponent={AuthErrorFallback}>
        <Suspense fallback={<AuthFormSkeleton />}>
          <GoogleSignInButton />
          <OrDivider />
          <LoginForm />
        </Suspense>
      </ErrorBoundary>

      <div className="mt-4 text-center">
        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-app-primary transition-colors">
          Forgot password?
        </Link>
      </div>

      <p className="mt-3 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-app-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
