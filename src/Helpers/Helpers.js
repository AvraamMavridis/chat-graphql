import cfg from '../config';

/**
 * Helper function that throws immediately
 * @param {string} msg
 */
export const err = msg => {
  throw new Error(msg);
};

/**
 * Creates a image string url
 *
 * @param {string} url
 * @param {string} [size]
 */
export const createImageUrl = (url, size = 'w320') => {
  return `${cfg.imageBaseUrl}/${size}${url}`;
};
