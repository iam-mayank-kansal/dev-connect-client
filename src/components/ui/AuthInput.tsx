import React from 'react';
import { AlertCircle, LucideIcon } from 'lucide-react';

// --- Generic Auth Input ---
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  containerClassName?: string;
}

export const AuthInput = ({
  label,
  icon: Icon,
  error,
  className = '',
  containerClassName = '',
  ...props
}: AuthInputProps) => {
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
          <Icon size={18} className="text-gray-400" />
        </div>
        <input
          {...props}
          className={`w-full border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${className}`}
        />
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
