import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { LivingScrollProvider } from "@/components/ui/LivingScrollProvider";
import { HyperCursor } from "@/components/ui/HyperCursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { RiiqxAssistant } from "@/components/ui/riiqx-assistant";
import { Toaster } from "sonner";
import { MusicProvider } from "@/context/MusicContext";
import { DynamicIsland } from "@/components/ui/DynamicIsland/DynamicIsland";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIIQX | Cinematic Print-on-Demand",
  description: "Experience the future of fashion. Original, superhero-inspired apparel.",
  icons: {
    icon: "/riiqx-logo.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents zooming for app-like feel
    viewportFit: "cover", // Utilizes notch area
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <MusicProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <LivingScrollProvider>
              <HyperCursor />
              <ScrollProgress />
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              {/* MusicPlayer removed - Integrated into DynamicIsland */}
              <RiiqxAssistant />
              <Footer />
            </LivingScrollProvider>
            <DynamicIsland /> {/* Placeholder for next step */}
            <CartSheet />
            <Toaster />
          </ThemeProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
