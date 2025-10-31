'use client';

import { useState, useEffect, useRef } from 'react';

const COLORS = ['Black', 'White', 'Gray', 'Blue', 'Brown', 'Green', 'Red', 'Pink', 'Yellow', 'Purple', 'Orange'];
const WARMTH_LEVELS = ['Cold', 'Cool', 'Neutral', 'Warm', 'Hot'];

interface FilterPanelProps {
  filters: {
    color: string;
    warmth: string;
    formalityMin: number;
    formalityMax: number;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [colorOpen, setColorOpen] = useState(false);
  const [warmthOpen, setWarmthOpen] = useState(false);
  const [formalityOpen, setFormalityOpen] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  const warmthRef = useRef<HTMLDivElement>(null);
  const formalityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setColorOpen(false);
      }
      if (warmthRef.current && !warmthRef.current.contains(event.target as Node)) {
        setWarmthOpen(false);
      }
      if (formalityRef.current && !formalityRef.current.contains(event.target as Node)) {
        setFormalityOpen(false);
      }
    };

    if (colorOpen || warmthOpen || formalityOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorOpen, warmthOpen, formalityOpen]);

  const handleReset = () => {
    onFilterChange({
      color: '',
      warmth: '',
      formalityMin: 1,
      formalityMax: 10,
    });
    setColorOpen(false);
    setWarmthOpen(false);
    setFormalityOpen(false);
  };

  const isFiltered = filters.color || filters.warmth || filters.formalityMin > 1 || filters.formalityMax < 10;

  return (
    <div className="bg-white border border-beige-light rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Color Dropdown */}
        <div className="relative" ref={colorRef}>
          <button
            onClick={() => setColorOpen(!colorOpen)}
            className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-beige-light rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-beige hover:shadow-md focus:outline-none focus:ring-2 focus:ring-beige/50 focus:border-beige"
          >
            <span>{filters.color || 'All Colors'}</span>
            <svg
              className={`w-4 h-4 text-beige transition-transform duration-200 ${colorOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Color Dropdown Panel */}
          {colorOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-beige-light rounded-lg shadow-lg p-2 z-10 animate-slideDown">
              <div className="max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    onFilterChange({ ...filters, color: '' });
                    setColorOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                    !filters.color
                      ? 'bg-beige text-white font-medium'
                      : 'text-gray-700 hover:bg-beige/10'
                  }`}
                >
                  All Colors
                </button>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onFilterChange({ ...filters, color });
                      setColorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                      filters.color === color
                        ? 'bg-beige text-white font-medium'
                        : 'text-gray-700 hover:bg-beige/10'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Warmth Dropdown */}
        <div className="relative" ref={warmthRef}>
          <button
            onClick={() => setWarmthOpen(!warmthOpen)}
            className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-beige-light rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-beige hover:shadow-md focus:outline-none focus:ring-2 focus:ring-beige/50 focus:border-beige"
          >
            <span>{filters.warmth || 'All Warmth'}</span>
            <svg
              className={`w-4 h-4 text-beige transition-transform duration-200 ${warmthOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Warmth Dropdown Panel */}
          {warmthOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-beige-light rounded-lg shadow-lg p-2 z-10 animate-slideDown">
              <button
                onClick={() => {
                  onFilterChange({ ...filters, warmth: '' });
                  setWarmthOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  !filters.warmth
                    ? 'bg-beige text-white font-medium'
                    : 'text-gray-700 hover:bg-beige/10'
                }`}
              >
                All Warmth
              </button>
              {WARMTH_LEVELS.map((warmth) => (
                <button
                  key={warmth}
                  onClick={() => {
                    onFilterChange({ ...filters, warmth });
                    setWarmthOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                    filters.warmth === warmth
                      ? 'bg-beige text-white font-medium'
                      : 'text-gray-700 hover:bg-beige/10'
                  }`}
                >
                  {warmth}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Formality Dropdown */}
        <div className="relative" ref={formalityRef}>
          <button
            onClick={() => setFormalityOpen(!formalityOpen)}
            className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-beige-light rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-beige hover:shadow-md focus:outline-none focus:ring-2 focus:ring-beige/50 focus:border-beige"
          >
            <span>Formality: {filters.formalityMin}-{filters.formalityMax}</span>
            <svg
              className={`w-4 h-4 text-beige transition-transform duration-200 ${formalityOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Formality Dropdown Panel */}
          {formalityOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-beige-light rounded-lg shadow-lg p-4 z-10 animate-slideDown">
              <div className="space-y-4">
                {/* Min Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-600">Minimum</label>
                    <span className="px-2 py-1 bg-beige/10 text-beige text-xs font-bold rounded">
                      {filters.formalityMin}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={filters.formalityMin}
                    onChange={(e) =>
                      onFilterChange({ ...filters, formalityMin: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #C3A27C 0%, #C3A27C ${(filters.formalityMin - 1) * 11.11}%, #E5E7EB ${(filters.formalityMin - 1) * 11.11}%, #E5E7EB 100%)`
                    }}
                  />
                </div>

                {/* Max Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-600">Maximum</label>
                    <span className="px-2 py-1 bg-beige/10 text-beige text-xs font-bold rounded">
                      {filters.formalityMax}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={filters.formalityMax}
                    onChange={(e) =>
                      onFilterChange({ ...filters, formalityMax: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #C3A27C 0%, #C3A27C ${(filters.formalityMax - 1) * 11.11}%, #E5E7EB ${(filters.formalityMax - 1) * 11.11}%, #E5E7EB 100%)`
                    }}
                  />
                </div>

                {/* Scale */}
                <div className="flex justify-between px-1 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span key={num} className="text-xs text-gray-400 font-medium">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="ml-auto px-4 py-2.5 text-sm font-medium text-beige-dark hover:text-white hover:bg-beige rounded-lg transition-all duration-200 animate-fadeIn"
          >
            Reset
          </button>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #C3A27C;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #A98862;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          transform: scale(1.15);
        }

        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #C3A27C;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #A98862;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          transform: scale(1.15);
        }

        select option {
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
