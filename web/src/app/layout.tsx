import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { BottomNav } from "@/components/layout/BottomNav";
import { LivingScrollProvider } from "@/components/ui/LivingScrollProvider";
import { HyperCursor } from "@/components/ui/HyperCursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { RiiqxAssistant } from "@/components/ui/riiqx-assistant";
import { Toaster } from "sonner";
import { MusicProvider } from "@/context/MusicContext";
import { DynamicIsland } from "@/components/ui/DynamicIsland/DynamicIsland";
import { ThemeProvider } from "@/components/providers/theme-provider";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
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
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
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
              <RiiqxAssistant />
              <Footer />
            </LivingScrollProvider>
            <DynamicIsland /> {/* Placeholder for next step */}
            <CartSheet />
            <BottomNav />
            <Toaster />
          </ThemeProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
