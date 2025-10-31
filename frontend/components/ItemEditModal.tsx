'use client';

import { useState, useEffect } from 'react';
import { wardrobeAPI } from '@/lib/api';

interface WardrobeItem {
  id: string;
  title: string;
  description: string;
  color: string;
  warmth: string;
  formality: number;
  image_url: string;
}

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
  onSuccess: () => void;
}

const COLORS = ['Black', 'White', 'Gray', 'Blue', 'Brown', 'Green', 'Red', 'Pink', 'Yellow', 'Purple', 'Orange'];
const WARMTH_LEVELS = ['Cold', 'Cool', 'Neutral', 'Warm', 'Hot'];

export default function ItemEditModal({ isOpen, onClose, item, onSuccess }: ItemEditModalProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [color, setColor] = useState(item?.color || 'Black');
  const [warmth, setWarmth] = useState(item?.warmth || 'Neutral');
  const [formality, setFormality] = useState(item?.formality || 5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Update state when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setColor(item.color);
      setWarmth(item.warmth);
      setFormality(item.formality);
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    setLoading(true);
    setError('');

    try {
      await wardrobeAPI.updateItem(item.id, {
        title,
        description,
        color,
        warmth,
        formality,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm('Are you sure you want to delete this item?')) return;

    setDeleting(true);
    setError('');

    try {
      await wardrobeAPI.deleteItem(item.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige"
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warmth</label>
              <select
                value={warmth}
                onChange={(e) => setWarmth(e.target.value)}
                className="w-full px-3 py-2 border border-beige-light rounded-md focus:outline-none focus:ring-2 focus:ring-beige"
              >
                {WARMTH_LEVELS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formality Level
            </label>
            <div className="bg-beige-lightest/30 rounded-lg p-4">
              <div className="flex items-center justify-center mb-3">
                <span className="px-4 py-2 bg-white rounded-lg text-lg font-semibold text-beige border border-beige-light">
                  {formality}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formality}
                onChange={(e) => setFormality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #C3A27C 0%, #C3A27C ${(formality - 1) * 11.11}%, #E5E7EB ${(formality - 1) * 11.11}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between mt-2 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num} className="text-xs text-gray-400 font-medium">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading || deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            disabled={loading || deleting}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || deleting}
            className="px-4 py-2 bg-beige hover:bg-beige-dark text-white rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #C3A27C;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #A98862;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #C3A27C;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #A98862;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
