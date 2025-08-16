// Auth utility functions
const TOKEN_KEY = 'authToken';
const USER_TYPE_KEY = 'userType';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getUserType = () => localStorage.getItem(USER_TYPE_KEY);

export const setUserType = (type) => {
  if (type) {
    localStorage.setItem(USER_TYPE_KEY, type);
  } else {
    localStorage.removeItem(USER_TYPE_KEY);
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  window.location.href = '/auth';
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// API request helper with auth header
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout(); // Redirect to login on auth failure
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
