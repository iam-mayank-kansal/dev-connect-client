import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  error?: string | null;
}

export const AuthHeader = ({
  icon: Icon,
  title,
  subtitle,
  error,
}: AuthHeaderProps) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon size={32} className="text-blue-600" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 text-sm">{subtitle}</p>
      {error && (
        <p className="text-red-600 mt-3 text-sm font-semibold bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </>
  );
};
