import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "./Button";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  required = false,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-stone-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="w-full border border-stone-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-stone-400 text-stone-900"
          placeholder="••••••••"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 hover:bg-transparent p-2"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </div>
    </div>
  );
}
