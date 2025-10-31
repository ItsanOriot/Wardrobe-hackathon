import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setRefreshToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
};

export const removeRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh_token');
  }
};

export const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_id', userId);
  }
};

export const removeUserId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id');
  }
};
