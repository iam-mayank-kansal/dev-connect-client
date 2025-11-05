'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import useDebounce from '@/hooks/useDebounce';
import Image from 'next/image';
import { getImageUrl } from '@/utils/helper/getImageUrl';

// Interface to match your API data
interface UserResult {
  _id: string;
  name: string;
  profilePicture: string;
  designation: string;
}

// --- ADDED: Prop type ---
interface LiveSearchProps {
  onResultClick?: () => void; // Optional function
}

export default function LiveSearch({ onResultClick }: LiveSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setResults] = useState<UserResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // Simplified Search Handler
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  // Fetch Search Results (using your API path)
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const fetchResults = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/devconnect/user/search?q=${debouncedSearchQuery}`
          );
          if (res.ok) {
            const data = await res.json();
            setResults(data);
            setIsSearchOpen(true);
          } else {
            setResults([]);
            setIsSearchOpen(false);
          }
        } catch (error) {
          console.error('Error fetching search:', error);
          setResults([]);
          setIsSearchOpen(false);
        }
      };
      fetchResults();
    } else {
      setResults([]);
      setIsSearchOpen(false);
    }
  }, [debouncedSearchQuery]);

  // Close Dropdown on Outside Click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close search and clear query
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className="flex-1 max-w-xs ml-4 relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative w-full">
        {/* ... (input field) ... */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setIsSearchOpen(true);
          }}
          placeholder="Search developers..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </form>

      {/* Search Results Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden">
          {searchResults.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {searchResults.map((user) => {
                const imageUrl =
                  user.profilePicture &&
                  user.profilePicture !== 'default-profile.png'
                    ? getImageUrl(user.profilePicture, 'profilePicture') // <-- CHECK 'avatars' DIR
                    : '/images/default-profile.png';

                return (
                  <li key={user._id}>
                    <Link
                      href={`/profile/${user._id}`}
                      // --- MODIFIED: Call both functions on click ---
                      onClick={() => {
                        closeSearch();
                        onResultClick?.(); // Call the prop to close mobile menu
                      }}
                      className="flex items-center p-3 hover:bg-gray-50 transition"
                    >
                      <Image
                        src={imageUrl}
                        onError={(e) =>
                          (e.currentTarget.src = '/images/default-profile.png')
                        }
                        height={32}
                        width={32}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-3 bg-gray-200"
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.designation || 'No designation'}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-3">
              <p className="text-sm text-gray-500 text-center">
                No users found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
