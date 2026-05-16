import type { Metadata, Viewport } from "next";
import { Reem_Kufi, Tajawal, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
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
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

// ============================================
// البيانات الوصفية
// ============================================
export const metadata: Metadata = {
  title: {
    default: "شــورى — المحرك المعرفي السيادي",
    template: "%s | شــورى",
  },
  description:
    "المحرّك المعرفي الموحّد لمركز دعم اتخاذ القرار. استراتيجيات قطاعية مدعومة بالأدلة لدعم القرار السيادي.",
  keywords: [
    "شورى",
    "مركز دعم اتخاذ القرار",
    "مداولة استراتيجية",
    "صنع القرار",
    "السيادة المعرفية",
    "Shura MAG",
  ],
  authors: [{ name: "Shura MAG" }],
  creator: "Shura MAG",
  publisher: "Shura MAG",
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
    title: "شــورى — المحرّك المعرفي السيادي",
    description:
      "المحرّك المعرفي الموحّد لمركز دعم اتخاذ القرار. استراتيجيات قطاعية مدعومة بالأدلة لدعم القرار السيادي.",
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
// إعدادات Viewport
// ============================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#06070A",
  colorScheme: "dark",
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
      className={`dark ${reemKufi.variable} ${tajawal.variable} ${cormorant.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="min-h-screen bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] antialiased"
        suppressHydrationWarning
      >
        {/* تخطي للمحتوى الرئيسي — إمكانية الوصول */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:rounded-lg focus:border focus:border-[rgb(var(--gold-base))] focus:bg-[rgb(var(--bg-elevated))] focus:px-4 focus:py-2 focus:text-[rgb(var(--gold-bright))]"
        >
          تخطّى إلى المحتوى الرئيسي
        </a>

        {/* المحتوى */}
        <div id="main-content" className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
