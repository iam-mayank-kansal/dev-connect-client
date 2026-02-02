'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Code } from 'lucide-react';

// ➤ CHANGE 1: Import the Store instead of Context
import { useAuthStore } from '@/store/useAuthStore';

// Sub-components
import NavbarLogo from './NavbarLogo';
import DesktopNav from './DesktopNav';
import SearchBar from './SearchBar';
import AuthSection from './AuthSection';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  // ➤ Get state directly from the Store
  // NOTE: Auth is already checked in AuthProvider, no need to call checkAuth again
  const { authUser, logout, isCheckingAuth } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Reset states on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchExpanded(false);
  }, [pathname]);

  // Global Keyboard Shortcuts (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchExpanded((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ➤ CHANGE 3: Simplified Logout Logic
  const handleLogOut = async () => {
    await logout(); // The store handles the API call and state clearing
    router.push('/login');
  };

  // --- Auth Pages Logic (Hide Navbar content) ---
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center py-4 px-6 sticky top-0 z-50">
        <NavbarLogo />
        {!authUser && (
          <AuthSection
            user={authUser}
            onLogout={handleLogOut}
            searchExpanded={searchExpanded}
          />
        )}
      </nav>
    );
  }

  // --- Loading State ---
  if (isCheckingAuth) {
    return (
      <nav className="w-full bg-white border-b border-gray-100 flex justify-between items-center py-3 px-6 sticky top-0 z-50">
        <div className="flex items-center text-blue-700 font-bold text-2xl mr-10">
          <Code size={28} className="mr-2" />
          Devconnect
        </div>
        <div className="animate-pulse h-10 w-24 bg-gray-100 rounded-lg"></div>
      </nav>
    );
  }

  // --- Main Layout ---
  // Show minimal navbar for unauthenticated users on home page
  if (!authUser) {
    return (
      <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-4 md:px-6 max-w-[1600px] mx-auto">
          <NavbarLogo searchExpanded={searchExpanded} />
          <div className="flex items-center gap-3">
            <AuthSection
              user={authUser}
              onLogout={handleLogOut}
              searchExpanded={searchExpanded}
            />
          </div>
        </div>
      </nav>
    );
  }

  // --- Authenticated Layout ---
  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 px-4 md:px-6 max-w-[1600px] mx-auto">
        {/* Left Side */}
        <NavbarLogo searchExpanded={searchExpanded} />

        {/* Center: Desktop Links & Search */}
        <div className="flex flex-1 items-center justify-end md:justify-center gap-2 md:gap-6 px-2">
          <DesktopNav searchExpanded={searchExpanded} />
          <SearchBar
            isExpanded={searchExpanded}
            setExpanded={setSearchExpanded}
          />
        </div>

        {/* Right Side: Auth & Mobile Toggle */}
        <div className="flex items-center gap-3 pl-2">
          <AuthSection
            user={authUser}
            onLogout={handleLogOut}
            searchExpanded={searchExpanded}
          />

          {/* Mobile Burger Button */}
          <button
            className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        user={authUser}
        onLogout={handleLogOut}
      />
    </nav>
  );
}
