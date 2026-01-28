'use client';
import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';
import { NAV_LINKS } from './nav-data';
import LiveSearch from './LiveSearch';
import { User as UserEntity } from '@/lib/types/entities';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  user: UserEntity | null;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  user,
  onLogout,
}: MobileMenuProps) {
  return (
    <div
      className={`md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 transition-all duration-300 ease-out origin-top z-40 ${
        isOpen
          ? 'opacity-100 scale-y-100 visible'
          : 'opacity-0 scale-y-95 invisible h-0'
      }`}
    >
      <div className="p-4 space-y-4 shadow-xl">
        <div className="bg-gray-50 rounded-lg p-1 border border-gray-100">
          <LiveSearch onResultClick={() => setIsOpen(false)} />
        </div>

        <nav className="grid gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors font-medium"
            >
              <link.icon
                size={20}
                className="text-gray-400 group-hover:text-blue-500"
              />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-100">
          {!user ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex justify-center py-2.5 text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-xl"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex justify-center py-2.5 text-white font-medium bg-blue-600 rounded-xl shadow-sm"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {/* ➤ FIX: Use _id here too */}
              <Link
                href={`/profile/${user._id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
              >
                <User size={20} /> Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
              >
                <Settings size={20} /> Settings
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
