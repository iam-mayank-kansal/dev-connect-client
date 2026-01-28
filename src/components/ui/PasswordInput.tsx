'use client';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Lock } from 'lucide-react';
import { useState } from 'react';

// --- Password Input ---
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const PasswordInput = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={containerClassName}>
      <label
        htmlFor={props.id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock size={18} className="text-gray-400" />
        </div>
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`w-full border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center animate-in slide-in-from-top-1">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
