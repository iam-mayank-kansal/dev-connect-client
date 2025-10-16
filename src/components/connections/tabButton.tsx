'use client';
import React from 'react';
import { TabButtonInterface } from '@/lib/types/connection';

export const TabButton = ({
  isActive,
  onClick,
  children,
}: TabButtonInterface) => {
  const baseClasses =
    'flex items-center px-4 py-3 rounded-lg w-full text-left transition-colors duration-200';
  const activeClasses = 'bg-blue-100 text-blue-800 font-semibold';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-100';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};
