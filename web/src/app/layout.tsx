import { Montserrat, Roboto, Playfair_Display, Oswald } from "next/font/google";

import "./globals.css";
/* import "./stranger-verse.css"; */
import "./cricket-theme.css";
import { Navbar } from "@/components/layout/Navbar";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { CartSheet } from "@/components/cart/CartSheet";
import { BottomNav } from "@/components/layout/BottomNav";
import { LivingScrollProvider } from "@/components/ui/LivingScrollProvider";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Toaster } from "sonner";
import { MusicProvider } from "@/context/MusicContext";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SocialProofNotifications } from "@/components/shared/SocialProofNotifications";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/layout/PageTransition";
import { KonamiCode } from "@/components/ui/KonamiCode";
import { MotionConfig } from "framer-motion";
import { StylistSidebar } from "@/components/ai/StylistSidebar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://riiqx.com'),
  title: {
    default: "RIIQX | Cinematic Print-on-Demand",
    template: "%s | RIIQX"
  },
  description: "Experience the future of fashion. Original, superhero-inspired apparel and streetwear.",
  keywords: ["Streetwear", "Fashion", "Superhero", "RIIQX", "Luxury", "Drops"],
  authors: [{ name: "RIIQX Design Team" }],
  creator: "RIIQX",
  icons: {
    icon: "/riiqx-logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riiqx.com",
    title: "RIIQX | Cinematic Print-on-Demand",
    description: "Experience the future of fashion. Original, superhero-inspired apparel.",
    siteName: "RIIQX Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RIIQX Store Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIIQX | Cinematic Print-on-Demand",
    description: "Experience the future of fashion. Original, superhero-inspired apparel.",
    images: ["/og-image.jpg"],
    creator: "@riiqx_official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${montserrat.variable} ${playfair.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <MotionConfig
          reducedMotion="user"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <MusicProvider>
            <ThemeProvider attribute="data-mode" defaultTheme="electronics" enableSystem={false} themes={["fashion", "electronics"]}>
              <KonamiCode />
              <LivingScrollProvider>
                <ScrollProgress />
                <Navbar />
                <main className="flex-grow pb-24 md:pb-0">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <FooterMinimal />
              </LivingScrollProvider>

              <CartSheet />
              <BottomNav />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0B0B0B',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  },
                }}
              />
              <SocialProofNotifications />
              <StylistSidebar />
              <CustomCursor />
            </ThemeProvider>
          </MusicProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
