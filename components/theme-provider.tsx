'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Iframe yoki URL orqali keluvchi ?theme=dark / ?theme=light parametrini qo'llab-quvvatlash
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryTheme = params.get('theme');
        if (queryTheme === 'dark' || queryTheme === 'light') {
          if (queryTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
          localStorage.setItem('theme', queryTheme);
        }

        // PostMessage orqali iframe bilan sinxronlash
        const handleMessage = (event: MessageEvent) => {
          if (event.data && event.data.type === 'SET_THEME' && (event.data.theme === 'dark' || event.data.theme === 'light')) {
            if (event.data.theme === 'dark') {
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.style.colorScheme = 'light';
            }
            localStorage.setItem('theme', event.data.theme);
          }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }
    } catch {}
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProvider;
