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
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-beige-light/60 px-6 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-beige-50 rounded-xl transition-all font-medium"
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
            <span>Back to Chat</span>
          </button>
          <h1 className="text-2xl font-bold text-beige-dark">
            My Wardrobe
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterPanel filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-14 h-14 border-4 border-beige border-t-transparent rounded-full animate-spin shadow-glow" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-beige-100 mb-4">
              <svg className="w-8 h-8 text-beige-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg font-semibold mb-2">No items in your wardrobe yet</p>
            <p className="text-gray-500 text-sm">
              {filters.color || filters.warmth || filters.formalityMin > 1 || filters.formalityMax < 10
                ? 'Try adjusting your filters or add new items from the chat page.'
                : 'Add clothing items using the camera icon on the chat page.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-beige-light rounded-xl shadow-soft">
                <span className="text-sm font-semibold text-gray-700">
                  Showing {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:scale-105 border border-beige-light"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm truncate mb-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-beige-100 text-beige-dark rounded-lg font-medium">{item.color}</span>
                      <span className="px-2 py-1 bg-beige-50 text-beige-dark rounded-lg font-bold">{item.formality}/10</span>
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
