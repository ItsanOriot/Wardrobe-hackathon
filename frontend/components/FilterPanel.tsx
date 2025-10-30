'use client';

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
  const handleReset = () => {
    onFilterChange({
      color: '',
      warmth: '',
      formalityMin: 1,
      formalityMax: 10,
    });
  };

  return (
    <div className="bg-white border border-beige-light rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-beige-dark hover:text-beige transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <select
            value={filters.color}
            onChange={(e) => onFilterChange({ ...filters, color: e.target.value })}
            className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige text-sm"
          >
            <option value="">All Colors</option>
            {COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warmth</label>
          <select
            value={filters.warmth}
            onChange={(e) => onFilterChange({ ...filters, warmth: e.target.value })}
            className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige text-sm"
          >
            <option value="">All Warmth</option>
            {WARMTH_LEVELS.map((warmth) => (
              <option key={warmth} value={warmth}>
                {warmth}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Formality: {filters.formalityMin}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={filters.formalityMin}
            onChange={(e) =>
              onFilterChange({ ...filters, formalityMin: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Formality: {filters.formalityMax}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={filters.formalityMax}
            onChange={(e) =>
              onFilterChange({ ...filters, formalityMax: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
