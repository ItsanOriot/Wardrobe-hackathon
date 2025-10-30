'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeAccessToken, removeUserId } from '@/lib/supabase';

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    removeAccessToken();
    removeUserId();
    router.push('/login');
  };

  const handleWardrobe = () => {
    router.push('/wardrobe');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-beige hover:bg-beige-dark text-white flex items-center justify-center transition-colors"
        aria-label="Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white border border-beige-light rounded-lg shadow-lg py-2 min-w-[160px] z-50">
          <button
            onClick={handleWardrobe}
            className="w-full px-4 py-2 text-left hover:bg-beige-lightest transition-colors"
          >
            Wardrobe
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left hover:bg-beige-lightest transition-colors text-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
