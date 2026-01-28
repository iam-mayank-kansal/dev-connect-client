'use client';
import Link from 'next/link';
import { NAV_LINKS } from './nav-data';

export default function DesktopNav({
  searchExpanded,
}: {
  searchExpanded: boolean;
}) {
  return (
    <div
      className={`hidden md:flex items-center gap-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        searchExpanded
          ? 'opacity-0 translate-x-4 pointer-events-none w-0 overflow-hidden'
          : 'opacity-100 translate-x-0 w-auto'
      }`}
    >
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`group flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-blue-600`}
          title={link.label}
        >
          <link.icon size={20} className="flex-shrink-0" />
          <span className="whitespace-nowrap font-medium text-sm ml-2 max-w-[120px] hidden lg:inline-block">
            {link.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
