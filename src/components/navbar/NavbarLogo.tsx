'use client';
import Link from 'next/link';
import { Code } from 'lucide-react';

export default function NavbarLogo({
  searchExpanded = false,
  className = '',
}: {
  searchExpanded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center transition-all duration-300 ${searchExpanded ? 'w-10' : 'w-auto'} ${className}`}
    >
      <Link
        href="/"
        className="flex items-center text-blue-700 font-bold text-2xl transition-all duration-300 group"
      >
        <Code
          size={28}
          className="mr-2 flex-shrink-0 group-hover:scale-110 transition-transform"
        />
        <span
          className={`transition-all duration-300 origin-left ${'scale-100 opacity-100 w-auto'} hidden md:block`}
        >
          Devconnect
        </span>
      </Link>
    </div>
  );
}
