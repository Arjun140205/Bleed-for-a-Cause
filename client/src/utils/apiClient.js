/**
 * API client with retry logic and error handling
 */

import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep function for retry delay
 * @param {number} ms - Milliseconds to sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make API request with retry logic
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const apiRequest = async (url, options = {}) => {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Show retry toast on server errors
      if (attempt < MAX_RETRIES - 1) {
        toast.info(`Retrying request... (${attempt + 1}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY * (attempt + 1));
      }
    }
  }

  // If all retries failed
  throw lastError;
};

/**
 * Get authentication headers
 * @returns {Object} - Headers object with auth token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Make authenticated API request
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const authenticatedRequest = async (url, options = {}) => {
  return apiRequest(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });
};
