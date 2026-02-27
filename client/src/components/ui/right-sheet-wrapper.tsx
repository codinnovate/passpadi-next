"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface RightSheetWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export default function RightSheetWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  footer,
}: RightSheetWrapperProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-[480px] p-0 flex flex-col gap-0",
          className
        )}
      >
        {/* Header */}
        <SheetHeader className="border-b border-gray-100 dark:border-white/10 px-5 py-4">
          <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-sm text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {/* Optional sticky footer */}
        {footer && (
          <div className="border-t border-gray-100 dark:border-white/10 px-5 py-4">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
