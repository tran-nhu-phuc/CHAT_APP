/**
 * Access token key
 */
const ACCESS_TOKEN_KEY: string = 'access_token';

/**
 * Get access token
 *
 * @return Access token
 */
export const getAccessToken = (): string | null => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Set access token
 *
 * @param value - Access token
 */
export const setAccessToken = (value: string): void => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, value);
};

/**
 * Remove access token
 */
export const removeAccessToken = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};
