'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Code,
  BookOpen,
  Settings,
  LogOut,
  User,
  Group,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/context/user-context";
import { logoutUser } from "@/lib/api";

export default function Navbar() {
  const { user, logout, isLoading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleLogOut() {
    await logoutUser();
    logout();
    router.push("/login");
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Handle case where user state is still loading
  if (isLoading) {
    // Optionally return a loading state or a simpler navbar
    return (
      <nav className="w-full bg-white shadow-md border-b border-gray-100 flex justify-between items-center py-3 px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center text-blue-700 font-bold text-2xl mr-10">
          <Code size={28} className="mr-2" />
          Devconnect
        </Link>
        <div className="flex items-center gap-4">
          <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-lg"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="w-full bg-white shadow-md border-b border-gray-100 flex justify-between items-center py-3 px-6 sticky top-0 z-50">
        {/* Logo and Main Navigation */}
        <Link
          href="/"
          className="flex items-center text-blue-700 font-bold text-2xl mr-10"
        >
          <Code size={28} className="mr-2" />
          Devconnect
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-10">
          {/* documentation  */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/documentation"
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition"
            >
              <BookOpen size={18} className="mr-1" />
              Documentation
            </Link>
          </div>

          {/* connections  */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/connections"
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition"
            >
              <Users size={18} className="mr-1" />
              Connections
            </Link>
          </div>
        </div>

        {/* Right side - Auth buttons or User dropdown */}
        <div className="flex items-center gap-4">
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full pl-1 pr-3 py-1 transition"
                aria-label="User menu"
              >
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user.name || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email || ""}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button
                      className="flex cursor-pointer items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
                      onClick={handleLogOut}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              <Link
                href="/explore"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/documentation"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/community"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
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
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="block py-2 text-red-600 font-medium"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogOut();
                    }}
                  >
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