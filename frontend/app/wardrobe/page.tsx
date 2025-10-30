'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/supabase';
import { wardrobeAPI } from '@/lib/api';
import FilterPanel from '@/components/FilterPanel';
import ItemEditModal from '@/components/ItemEditModal';

interface WardrobeItem {
  id: string;
  title: string;
  description: string;
  color: string;
  warmth: string;
  formality: number;
  image_url: string;
}

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({
    color: '',
    warmth: '',
    formalityMin: 1,
    formalityMax: 10,
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetchItems();
  }, [router, filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const filterParams: any = {};
      if (filters.color) filterParams.color = filters.color;
      if (filters.warmth) filterParams.warmth = filters.warmth;
      if (filters.formalityMin > 1) filterParams.formality_min = filters.formalityMin;
      if (filters.formalityMax < 10) filterParams.formality_max = filters.formalityMax;

      const data = await wardrobeAPI.getItems(filterParams);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch wardrobe items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: WardrobeItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-beige-lightest">
      {/* Header */}
      <header className="bg-white border-b border-beige-light px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Chat</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">My Wardrobe</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-beige border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">No items in your wardrobe yet</p>
            <p className="text-gray-400 text-sm">
              {filters.color || filters.warmth || filters.formalityMin > 1 || filters.formalityMax < 10
                ? 'Try adjusting your filters or add new items from the chat page.'
                : 'Add clothing items using the camera icon on the chat page.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {items.length} item{items.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{item.color}</span>
                      <span>•</span>
                      <span>{item.formality}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <ItemEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
