import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthCard = ({ children, header, footer }: AuthCardProps) => {
  return (
    <main className="flex items-center justify-center  p-4 text-black">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-100">
        {header && <div className="text-center mb-8">{header}</div>}
        {children}
        {footer && <div className="mt-8 text-center">{footer}</div>}
      </div>
    </main>
  );
};
