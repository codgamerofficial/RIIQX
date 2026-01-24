import { Inter, Oswald, Montserrat } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { BottomNav } from "@/components/layout/BottomNav";
import { LivingScrollProvider } from "@/components/ui/LivingScrollProvider";
import { HyperCursor } from "@/components/ui/HyperCursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Toaster } from "sonner";
import { MusicProvider } from "@/context/MusicContext";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SocialProofNotifications } from "@/components/shared/SocialProofNotifications";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://riiqx.com'), // Replace with actual domain
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
        url: "/og-image.jpg", // Make sure to add this asset later
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
    images: ["/og-image.jpg"], // Same as OG
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
  userScalable: false, // Prevents zooming for app-like feel
  viewportFit: "cover", // Utilizes notch area
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
        className={`${inter.variable} ${oswald.variable} ${montserrat.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <MusicProvider>
          <ThemeProvider attribute="data-mode" defaultTheme="electronics" enableSystem={false} themes={["fashion", "electronics"]}>
            <LivingScrollProvider>
              <HyperCursor />
              <ScrollProgress />
              <Navbar />
              <main className="flex-grow pb-24 md:pb-0">
                {children}
              </main>
              {/* MusicPlayer removed - Integrated into DynamicIsland */}
              {/* RiiqxAssistant removed */}
              <Footer />
            </LivingScrollProvider>

            <CartSheet />
            <BottomNav />
            <Toaster />
            <SocialProofNotifications />
          </ThemeProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
