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

export const removeRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh_token');
  }
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
