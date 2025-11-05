'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Code,
  BookOpen,
  User,
  Users,
  CloudUpload,
  Settings,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/utils/context/user-context';
import { logoutUser } from '@/lib/api';
import { usePathname } from 'next/navigation';

// Import modular components
import LiveSearch from './nav/LiveSearch';
import UserMenu from './nav/UserMenu';

export default function Navbar() {
  const { user, logout, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogOut() {
    await logoutUser();
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  }

  // Minimal navbar for auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <nav className="w-full bg-white shadow-md border-b border-gray-100 flex justify-center items-center py-3 px-6 sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center text-blue-700 font-bold text-2xl"
        >
          <Code size={28} className="mr-2" />
          Devconnect
        </Link>
      </nav>
    );
  }

  // Loading state navbar
  if (isLoading) {
    return (
      <nav className="w-full bg-white shadow-md border-b border-gray-100 flex justify-between items-center py-3 px-6 sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center text-blue-700 font-bold text-2xl mr-10"
        >
          <Code size={28} className="mr-2" />
          Devconnect
        </Link>
        <div className="flex items-center gap-4">
          <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </nav>
    );
  }

  // Full responsive navbar
  return (
    <>
      <nav className="w-full bg-white shadow-md border-b border-gray-100 flex justify-between items-center py-3 px-6 sticky top-0 z-50">
        {/* Logo and Main Navigation */}
        <Link
          href="/"
          className="flex items-center text-blue-700 font-bold text-2xl mr-4 md:mr-10"
        >
          <Code size={28} className="mr-2" />
          Devconnect
        </Link>

        {/* Desktop Navigation & Search Bar (Responsive) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6">
          <Link
            href="/documentation"
            className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition p-2 rounded-lg hover:bg-gray-100"
          >
            <BookOpen size={18} />
            <span className="hidden lg:block ml-1">Documentation</span>
          </Link>
          <Link
            href="/connections"
            className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition p-2 rounded-lg hover:bg-gray-100"
          >
            <Users size={18} />
            <span className="hidden lg:block ml-1">Connections</span>
          </Link>
          <Link
            href="/create-blog"
            className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition p-2 rounded-lg hover:bg-gray-100"
          >
            <CloudUpload size={18} />
            <span className="hidden lg:block ml-1">Upload Post</span>
          </Link>

          <LiveSearch />
        </div>

        {/* Right side - Auth buttons or User dropdown */}
        <div className="flex items-center gap-2 md:gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <UserMenu user={user} onLogout={handleLogOut} />
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
            <div className="px-4 py-3 space-y-3">
              <LiveSearch onResultClick={() => setMobileMenuOpen(false)} />

              {/* Existing Mobile Links */}
              <Link
                href="/documentation"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/connections"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connections
              </Link>
              <Link
                href="/create-blog"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Upload Post
              </Link>

              {!user ? (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block py-2 text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  {/* --- FIX: Update the href to use user._id --- */}
                  <Link
                    href={`/profile/${user._id}`}
                    className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    className="flex items-center py-2 text-red-600 font-medium"
                    onClick={handleLogOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
