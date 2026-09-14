import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sirdaryo Xizmatlari - Guliston va Sirdaryo viloyati ustalari portali",
  description:
    "Guliston shahri, Yangiyer, Shirin, Boyovut va Sirdaryoning boshqa tumanlari bo'ylab ishonchli santexnik, elektrik, avto ta'mir, yuk tashish va maishiy xizmatlar katalogi.",
  keywords: [
    'Sirdaryo ustalar',
    'Guliston santexnik',
    'Guliston elektrik',
    'Yangiyer xizmatlar',
    'Sirdaryo yuk tashish',
    'Konditsioner ustasi Guliston',
    'Yevro tamir Guliston',
  ],
  authors: [{ name: 'Sirdaryo Xizmat' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#fffdfa] text-[#282624] selection:bg-orange-500 selection:text-white pb-20 md:pb-0">
        <Suspense fallback={<div className="h-16 sm:h-20 bg-[#fffdfa] border-b border-[#e6e0da]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
