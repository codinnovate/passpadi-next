"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/types/types";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/modules/auth/validation/auth.schemas";
import {
  useResetPasswordWithOTPMutation,
  useSendPasswordResetOTPMutation,
} from "@/store/api";

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const router = useRouter();
  const [resetPassword] = useResetPasswordWithOTPMutation();
  const [resendOTP] = useSendPasswordResetOTPMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      await resetPassword({
        email,
        otp: values.otp,
        password: values.password,
      }).unwrap();
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to reset password. Please try again.";
      setError(message);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError(null);
    try {
      await resendOTP({ email }).unwrap();
      setSuccess("New OTP sent to your email");
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        {/* OTP Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Verification Code</label>
          <Controller
            control={form.control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {form.formState.errors.otp && (
            <p className="text-sm text-destructive">
              {form.formState.errors.otp.message}
            </p>
          )}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending}
            className="text-xs text-app-primary hover:underline self-center mt-1 disabled:opacity-50"
          >
            {resending ? "Resending..." : "Didn't receive the code? Resend"}
          </button>
        </div>

        {/* New Password */}
        <CustomFormField
          control={form.control}
          name="password"
          label="New Password"
          placeholder="Enter new password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
        />

        <CustomFormField
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm new password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-app-primary text-white hover:bg-app-primary/90 text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Resetting..."
            : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
