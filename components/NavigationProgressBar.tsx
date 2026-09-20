'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Yo'nalish o'zgarganda (sahifa yuklanib bo'lganda) progressni 100% ga yetkazib yashirish
  useEffect(() => {
    if (visible) {
      setProgress(100);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      finishTimerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }
  }, [pathname, searchParams]);

  // Sahifadagi havolalar bosilganda loadingni boshlash
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const isTargetBlank = target.getAttribute('target') === '_blank';

      // Faqat ichki marshrutlar va yangi tabda ochilmaydigan havolalar uchun
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('#') &&
        !isTargetBlank &&
        href !== pathname
      ) {
        if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
        if (timerRef.current) clearTimeout(timerRef.current);

        setVisible(true);
        setProgress(25);

        timerRef.current = setTimeout(() => {
          setProgress(65);
          timerRef.current = setTimeout(() => {
            setProgress(85);
          }, 300);
        }, 150);
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Asosiy rang-barang progress bar */}
      <div
        className="h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(59,130,246,0.8),0_0_5px_rgba(99,102,241,0.6)]"
        style={{ width: `${progress}%` }}
      />
      {/* Uchidagi yorqin nuqta (glow indicator) */}
      <div
        className="absolute top-0 h-[3px] w-24 bg-white/40 blur-[1px] transition-all duration-300 ease-out"
        style={{ left: `calc(${progress}% - 96px)` }}
      />
    </div>
  );
}
