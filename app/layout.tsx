import type { Metadata, Viewport } from 'next';
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


export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blog-post-iota-three.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sirdaryo Xizmatlari - Guliston va Sirdaryo viloyati ustalari portali",
    template: "%s | Sirdaryo Xizmatlari",
  },
  description:
    "Guliston shahri, Yangiyer, Shirin, Boyovut va Sirdaryoning barcha tumanlari bo'ylab ishonchli santexnik, elektrik, avto ta'mir, yuk tashish va maishiy xizmatlar katalogi.",
  keywords: [
    'Sirdaryo ustalar',
    'Guliston santexnik',
    'Guliston elektrik',
    'Yangiyer xizmatlar',
    'Sirdaryo yuk tashish',
    'Konditsioner ustasi Guliston',
    'Yevro tamir Guliston',
    'Sirdaryo xizmatlar',
    'sindr sirdaryo',
  ],
  authors: [{ name: 'Sirdaryo Xizmat' }],
  creator: 'Sirdaryo Xizmatlari',
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: baseUrl,
    siteName: 'Sirdaryo Xizmatlari',
    title: 'Sirdaryo Xizmatlari - Ustalar va Xizmatlar Portali',
    description: "Guliston va Sirdaryo viloyati ustalari, santexnik, elektrik, avto ta'mir xizmatlari.",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Sirdaryo Xizmatlari',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sirdaryo Xizmatlari',
    description: "Guliston va Sirdaryo viloyatining barcha xizmatlari va ustalari bir joyda.",
    images: ['https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&auto=format&fit=crop&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
