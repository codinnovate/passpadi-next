"use client";

import * as React from "react";

interface MultiSelectComboboxProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: MultiSelectComboboxProps) {
  return (
    <div className={className}>
      <span className="text-muted-foreground text-sm">
        {selected.length > 0
          ? `${selected.length} selected`
          : placeholder ?? "Select..."}
      </span>
    </div>
  );
}
