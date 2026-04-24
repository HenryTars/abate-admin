export type Theme = 'light' | 'dark' | 'system';

const KEY = 'admin_theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(KEY) as Theme) ?? 'system';
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(KEY, theme);
}

export function applyTheme(theme: Theme): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}
