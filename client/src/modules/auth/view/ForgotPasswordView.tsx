"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import ForgotPasswordForm from "@/modules/auth/ui/ForgotPasswordForm";
import ResetPasswordForm from "@/modules/auth/ui/ResetPasswordForm";

export default function ForgotPasswordView() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Logo className="w-[120px]" />
        <h1 className="text-xl font-bold text-[#030229]">
          {email ? "Reset Password" : "Forgot Password"}
        </h1>
        <p className="text-sm text-gray-500 text-center">
          {email
            ? "Enter the OTP and your new password"
            : "Enter your email and we'll send you a code to reset your password"}
        </p>
      </div>

      {email ? (
        <ResetPasswordForm email={email} />
      ) : (
        <ForgotPasswordForm onOtpSent={setEmail} />
      )}

      <div className="mt-6 flex justify-center">
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-app-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </div>
  );
}
