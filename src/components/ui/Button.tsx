import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 disabled:bg-teal-300 disabled:opacity-70 shadow-sm",
    secondary:
      "bg-stone-100 text-stone-800 hover:bg-stone-200 focus:ring-stone-400 disabled:bg-stone-50 disabled:text-stone-400 border border-stone-200",
    ghost:
      "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-300 disabled:text-stone-300",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-red-100 disabled:bg-red-50 disabled:text-red-300",
  };

  const sizes: Record<Size, string> = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
