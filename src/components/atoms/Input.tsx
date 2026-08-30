import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

export function Input({ className, isInvalid = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
        isInvalid
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-300",
        className,
      )}
      {...props}
    />
  );
}
