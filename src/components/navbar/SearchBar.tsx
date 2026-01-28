'use client';
import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import LiveSearch from './LiveSearch';

interface SearchBarProps {
  isExpanded: boolean;
  setExpanded: (val: boolean) => void;
}

export default function SearchBar({ isExpanded, setExpanded }: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isExpanded) setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, setExpanded]);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isExpanded ? 'w-full max-w-2xl' : 'w-auto'
      }`}
    >
      {isExpanded ? (
        // Active Search State
        <div className="flex items-center w-full bg-white rounded-xl border ring-blue-50 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="pl-3 text-blue-500">
            <Search size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <LiveSearch />
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="p-3 text-gray-400 hover:text-red-500 rounded-r-xl transition-colors"
          >
            <X size={18} className="cursor-pointer" />
          </button>
        </div>
      ) : (
        // Inactive "Fake Input" Trigger
        <button
          onClick={() => setExpanded(true)}
          className="group flex items-center gap-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm hover:ring-2 hover:ring-gray-100 text-gray-500 px-3 py-2 rounded-full transition-all duration-200"
        >
          <Search
            size={18}
            className="group-hover:text-blue-600 transition-colors"
          />
          <span className="hidden md:inline font-medium text-sm text-gray-400 group-hover:text-gray-600">
            Search...
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 pointer-events-none h-5 select-none rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      )}
    </div>
  );
}
