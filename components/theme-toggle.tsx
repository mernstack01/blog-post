'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`w-9 h-9 rounded-2xl bg-[#f6f3ef] dark:bg-[#2a2724] border border-[#e6e0da] dark:border-[#3d3835] flex items-center justify-center text-[#67625d] dark:text-[#a8a29e] opacity-70 transition-colors ${className}`}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = (resolvedTheme || theme) === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
      title={isDark ? "Yorug' rejim (Light mode)" : "Tungi rejim (Dark mode)"}
      className={`relative w-9 h-9 rounded-2xl bg-[#f6f3ef] hover:bg-[#ede8e1] dark:bg-[#2a2724] dark:hover:bg-[#34302c] border border-[#e6e0da] dark:border-[#3d3835] flex items-center justify-center text-[#67625d] hover:text-[#282624] dark:text-[#a8a29e] dark:hover:text-white transition-all duration-300 cursor-pointer active:scale-95 touch-manipulation shadow-2xs ${className}`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-sky-400" />
    </button>
  );
}

export default ThemeToggle;
