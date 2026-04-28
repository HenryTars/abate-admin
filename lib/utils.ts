const STORAGE_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:8000';

const EMULATOR_ORIGINS = [
  'http://10.0.2.2:8000',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'https://abate-backend.onrender.com',
];

/**
 * Rewrites image URLs that were stored with the Android emulator host
 * (10.0.2.2) so they resolve correctly from a desktop browser.
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const origin of EMULATOR_ORIGINS) {
    if (url.startsWith(origin)) {
      return STORAGE_BASE + url.slice(origin.length);
    }
  }
  return url;
}