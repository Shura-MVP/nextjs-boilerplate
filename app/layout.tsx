import type { Metadata, Viewport } from "next";
import { Reem_Kufi, Tajawal, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// ============================================
// تحميل الخطوط — محسّن للأداء
// ============================================
const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-reem-kufi",
  display: "swap",
  preload: true,
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

// ============================================
// البيانات الوصفية (Metadata)
// ============================================
export const metadata: Metadata = {
  title: {
    default: "شــورى",
    template: "%s | شــورى",
  },
  description: "منظومة المداولة الاستراتيجية متعددة الوكلاء",
  keywords: ["شورى", "مداولة", "استراتيجية", "صنع القرار"],
  authors: [{ name: "Shura" }],
  creator: "Shura",
  publisher: "Shura",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shura.example"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: "شــورى",
    description: "منظومة المداولة الاستراتيجية متعددة الوكلاء",
    siteName: "شــورى",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// ============================================
// إعدادات Viewport — حرجة للموبايل
// ============================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1A10" },
  ],
  colorScheme: "light dark",
};

// ============================================
// الـ Root Layout
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${reemKufi.variable} ${tajawal.variable} ${cormorant.variable}`}
    >
      <head>
        {/* تحميل مسبق لتحسين السرعة */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="shura-theme"
        >
          {/* مهارة الوصول — للقارئات الشاشة */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:rounded-md focus:bg-[rgb(var(--accent))] focus:px-4 focus:py-2 focus:text-[rgb(var(--accent-foreground))]"
          >
            تخطّى إلى المحتوى الرئيسي
          </a>

          {/* المحتوى الرئيسي */}
          <div id="main-content" className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
