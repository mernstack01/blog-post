import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        <Suspense fallback={<div className="h-16 sm:h-20 bg-white border-b border-slate-200" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
