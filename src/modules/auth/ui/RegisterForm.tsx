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
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/validation/auth.schemas";
import { Mail, User } from "lucide-react";
import { useRegisterMutation } from "@/store/api";

export default function RegisterForm() {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      await register({
        fullname: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        app: "90percent",
      }).unwrap();

      setSuccess("Account created! Check your email to verify your account.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.data?.error || "Registration failed. Please try again.";
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
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <CustomFormField
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          fieldType={FormFieldType.INPUT}
          iconSrc={<User size={18} />}
        />

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
          placeholder="Create a password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
        />

        <CustomFormField
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat your password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-purple text-white hover:bg-purple/90 text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
