import { createClient } from 'redis';
import { promisify } from 'util';

// Create Redis client
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error:', err));

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const CACHE_TTL = 300; // 5 minutes in seconds

/**
 * Cache donor search results
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 */
export const cacheDonorResults = async (key, data) => {
  try {
    await setAsync(key, JSON.stringify(data), 'EX', CACHE_TTL);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

/**
 * Get cached donor results
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null
 */
export const getCachedDonors = async (key) => {
  try {
    const cached = await getAsync(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Generate cache key for donor search
 * @param {Object} params - Search parameters
 * @returns {string} - Cache key
 */
export const generateDonorCacheKey = (params) => {
  const { bloodType, lat, lng, radius, page, limit } = params;
  return `donors:${bloodType}:${lat.toFixed(2)}:${lng.toFixed(2)}:${radius}:${page}:${limit}`;
};
