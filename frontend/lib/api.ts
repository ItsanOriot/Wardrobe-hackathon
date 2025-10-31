import { getAccessToken, removeAccessToken, removeRefreshToken, removeUserId } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to make authenticated API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(typeof options.headers === 'object' && options.headers !== null && !(options.headers instanceof Headers)
        ? (options.headers as Record<string, string>)
        : {}),
    },
  });

  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401) {
    // Clear auth tokens and redirect to login
    removeAccessToken();
    removeRefreshToken();
    removeUserId();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (email: string, password: string) =>
    fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Scan API
export const scanAPI = {
  scanImage: async (file: File) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/scan/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Scan failed' }));
      throw new Error(error.detail || 'Scan failed');
    }

    return response.json();
  },
};

// Wardrobe API
export const wardrobeAPI = {
  getItems: (filters?: {
    color?: string;
    warmth?: string;
    formality_min?: number;
    formality_max?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.color) params.append('color', filters.color);
    if (filters?.warmth) params.append('warmth', filters.warmth);
    if (filters?.formality_min) params.append('formality_min', filters.formality_min.toString());
    if (filters?.formality_max) params.append('formality_max', filters.formality_max.toString());

    const queryString = params.toString();
    return fetchAPI(`/wardrobe/${queryString ? `?${queryString}` : ''}`);
  },

  createItem: async (itemData: {
    title: string;
    description: string;
    color: string;
    warmth: string;
    formality: number;
    file: File;
  }) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('color', itemData.color);
    formData.append('warmth', itemData.warmth);
    formData.append('formality', itemData.formality.toString());
    formData.append('file', itemData.file);

    const response = await fetch(`${API_BASE_URL}/wardrobe/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create item';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  updateItem: (itemId: string, updates: {
    title?: string;
    description?: string;
    color?: string;
    warmth?: string;
    formality?: number;
  }) =>
    fetchAPI(`/wardrobe/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteItem: (itemId: string) =>
    fetchAPI(`/wardrobe/${itemId}`, {
      method: 'DELETE',
    }),
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string, history: { role: string; content: string }[]) =>
    fetchAPI('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
