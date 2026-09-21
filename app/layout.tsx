import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blog-post-iota-three.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TopBaza.uz - Sirdaryo va O'zbekiston Kadrlar, Maskonlar va Xizmatlar Portali",
    template: "%s | TopBaza.uz",
  },
  description:
    "TopBaza.uz - Sirdaryo viloyati va O'zbekiston bo'yicha barcha soha kadrlari, mutaxassislar, o'quv markazlari, kafe-restoranlar, tibbiyot va xizmatlarining yagona ma'lumotlar bazasi.",
  keywords: [
    'TopBaza',
    'TopBaza.uz',
    'Sirdaryo kadrlar',
    'Sirdaryo mutaxassislar',
    'Guliston o\'quv markazlari',
    'Guliston restoranlar va kafe',
    'Sirdaryo shifokorlari',
    'Guliston ustalar',
    'Sirdaryo xizmatlar bazasi',
    'Sirdaryo gid',
    'Guliston xizmatlar',
  ],
  authors: [{ name: 'TopBaza.uz' }],
  creator: 'TopBaza.uz',
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: baseUrl,
    siteName: 'TopBaza.uz',
    title: 'TopBaza.uz - Sirdaryo va O\'zbekiston Kadrlar, Maskonlar va Xizmatlar Portali',
    description: "Sirdaryo viloyatining barcha mutaxassislari, kadrlar, ziyorat va dam olish maskanlari, o'quv markazlari hamda xizmatlar bazasi.",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'TopBaza.uz Xizmatlari',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TopBaza.uz',
    description: "Guliston va Sirdaryo viloyatining barcha xizmatlari va ustalari bir joyda.",
    images: ['https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&auto=format&fit=crop&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};


import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { getCurrentUserAction } from '@/actions/user-auth-actions';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import NavigationProgressBar from '@/components/NavigationProgressBar';
import { cookies } from 'next/headers';
import type { Language } from '@/lib/translations';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Language | undefined;
  const initialLang: Language = cookieLocale === 'ru' ? 'ru' : 'uz';

  const userRes = await getCurrentUserAction();

  return (
    <html lang={initialLang} suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#fffdfa] dark:bg-[#0f172a] text-[#1e293b] dark:text-[#f8fafc] selection:bg-blue-600 selection:text-white pb-20 md:pb-0 transition-colors duration-200">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider initialUser={userRes.user}>
            <LanguageProvider initialLang={initialLang}>
              <Suspense fallback={<div className="h-14 sm:h-16 bg-[#fffdfa] dark:bg-[#1c1917] border-b border-[#e6e0da] dark:border-[#383430]" />}>
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Suspense fallback={null}>
                <BottomNav />
              </Suspense>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

