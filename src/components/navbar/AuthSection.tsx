'use client';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { User } from '@/lib/types/entities';

interface AuthSectionProps {
  user: User | null;
  onLogout: () => void;
  searchExpanded: boolean;
}

export default function AuthSection({
  user,
  onLogout,
  searchExpanded,
}: AuthSectionProps) {
  if (user) {
    return (
      <div className={`${searchExpanded ? 'hidden lg:block' : 'block'}`}>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 transition-opacity duration-300 ${searchExpanded ? 'hidden lg:flex opacity-50' : 'flex'}`}
    >
      <Link
        href="/login"
        className="hidden sm:block text-gray-600 hover:text-blue-600 font-medium text-sm"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 hover:shadow transition-all"
      >
        Sign up
      </Link>
    </div>
  );
}
