import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MusicPlayer } from "@/components/ui/music-player";
import { RiiqxAssistant } from "@/components/ui/riiqx-assistant";
import { Toaster } from "sonner";
import { MusicProvider } from "@/context/MusicContext";
import { DynamicIsland } from "@/components/ui/dynamic-island";
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
            <SmoothScroll>
              <ScrollProgress />
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <MusicPlayer />
              <RiiqxAssistant />
              <Footer />
            </SmoothScroll>
            <DynamicIsland /> {/* Placeholder for next step */}
            <CartSheet />
            <Toaster />
          </ThemeProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
