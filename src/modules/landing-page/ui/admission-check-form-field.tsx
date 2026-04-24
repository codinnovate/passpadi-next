"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AdmissionCheckFormFieldProps = {
  autoFocus?: boolean;
  className?: string;
  inputMode?: "numeric" | "tel";
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email";
  value: string;
  variant: "input" | "phone" | "textarea";
};

export function AdmissionCheckFormField({
  autoFocus,
  className,
  inputMode,
  onChange,
  placeholder,
  type,
  value,
  variant,
}: AdmissionCheckFormFieldProps) {
  if (variant === "textarea") {
    return (
      <Textarea
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "min-h-40 rounded-3xl bg-white px-5 py-4 text-lg text-[#002769] placeholder:text-neutral-400",
          className
        )}
      />
    );
  }

  return (
    <Input
      autoFocus={autoFocus}
      type={type}
      inputMode={variant === "phone" ? "tel" : inputMode}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-16 rounded-3xl bg-white px-5 text-xl font-semibold text-[#002769] placeholder:text-neutral-400",
        className
      )}
    />
  );
}
