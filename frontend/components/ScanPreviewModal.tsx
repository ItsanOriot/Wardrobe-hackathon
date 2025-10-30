'use client';

import { useState } from 'react';
import { wardrobeAPI } from '@/lib/api';

interface ScanResult {
  title: string;
  description: string;
  color: string;
  warmth: string;
  formality: number;
}

interface ScanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanResult | null;
  imageFile: File | null;
  onSuccess: () => void;
}

export default function ScanPreviewModal({
  isOpen,
  onClose,
  scanResult,
  imageFile,
  onSuccess,
}: ScanPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!scanResult || !imageFile) return;

    setLoading(true);
    setError('');

    try {
      await wardrobeAPI.createItem({
        ...scanResult,
        file: imageFile,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !scanResult) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Confirm Item Details</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <p className="text-gray-900">{scanResult.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-900">{scanResult.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <p className="text-gray-900">{scanResult.color}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warmth</label>
              <p className="text-gray-900">{scanResult.warmth}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formality</label>
              <p className="text-gray-900">{scanResult.formality}/10</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-beige hover:bg-beige-dark text-white rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Wardrobe'}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You can edit these details later from your wardrobe.
        </p>
      </div>
    </div>
  );
}
