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
  icons: {
    icon: [
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: baseUrl,
    siteName: 'TopBaza.uz',
    title: 'TopBaza.uz - Sirdaryo va O\'zbekiston Kadrlar, Maskonlar va Xizmatlar Portali',
    description: "Sirdaryo viloyatining barcha mutaxassislari, kadrlar, ziyorat va dam olish maskanlari, o'quv markazlari hamda xizmatlar bazasi.",
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 1200,
        alt: 'TopBaza.uz Xizmatlar Portali Logosi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TopBaza.uz',
    description: "Guliston va Sirdaryo viloyatining barcha xizmatlari va ustalari bir joyda.",
    images: ['/logo.jpg'],
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
      <body suppressHydrationWarning className="app-body min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider initialUser={userRes.user}>
            <LanguageProvider initialLang={initialLang}>
              <Suspense fallback={<div className="h-14 sm:h-16 bg-background border-b border-border" />}>
                <Header />
              </Suspense>
              <main className="min-w-0 w-full flex-1">{children}</main>
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

