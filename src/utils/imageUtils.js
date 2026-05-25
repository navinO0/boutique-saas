import API_BASE_URL from '../config/api';

/**
 * Resolves the image URL.
 * If the path starts with http, returns as is.
 * Otherwise, prefixes with the backend source URL.
 */
export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // The backend base URL is usually one level up from /api
  const serverBase = API_BASE_URL.replace('/api', '');
  return `${serverBase}${path.startsWith('/') ? '' : '/'}${path}`;
};
