"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/types/types";
import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/validation/auth.schemas";
import { Mail } from "lucide-react";
import { useLoginMutation } from "@/store/api";

export default function LoginForm() {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const result = await login({
        email: values.email,
        password: values.password,
        app: "90percent",
      }).unwrap();

      if (result.mfaRequired) {
        // TODO: redirect to MFA verification page
        setError("MFA verification required. Please complete 2FA.");
        return;
      }

      router.push("/");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.data?.error || "Login failed. Please try again.";
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

        <CustomFormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          fieldType={FormFieldType.INPUT}
          iconSrc={<Mail size={18} />}
        />

        <CustomFormField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-app-primary text-white hover:bg-app-primary/90 text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
