// utils/csrfMeta.js
let csrfTokenCache = null;

export function getCachedCsrfToken() {
  return csrfTokenCache;
}

export function setCachedCsrfToken(token) {
  csrfTokenCache = token;
}

export function clearCsrfToken() {
  csrfTokenCache = null;
}