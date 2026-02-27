"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/types/types";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/modules/auth/validation/auth.schemas";
import { Mail } from "lucide-react";
import { useSendPasswordResetOTPMutation } from "@/store/api";

interface ForgotPasswordFormProps {
  onOtpSent: (email: string) => void;
}

export default function ForgotPasswordForm({
  onOtpSent,
}: ForgotPasswordFormProps) {
  const [sendOTP] = useSendPasswordResetOTPMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      await sendOTP({ email: values.email }).unwrap();
      setSuccess("OTP sent to your email");
      onOtpSent(values.email);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to send OTP. Please try again.";
      setError(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <CustomFormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          fieldType={FormFieldType.INPUT}
          iconSrc={<Mail size={18} />}
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-app-primary text-white hover:bg-app-primary/90 text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
}
