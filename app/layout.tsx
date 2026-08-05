import type { Metadata } from 'next';
import '../tokens.css';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { JsonLd } from '@/components/seo/JsonLd';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://riiqx.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'RIIQX — Cybernetic Luxury Streetwear',
    template: '%s | RIIQX Cybernetic Luxury Apparel',
  },
  description:
    'Official dark-mode luxury streetwear component library, drop store, and technical apparel standard.',
  keywords: [
    'RIIQX',
    'Streetwear',
    'Cybernetic Fashion',
    'Tactical Apparel',
    'Techwear India',
    'Heavyweight Hoodies',
    'Luxury Streetwear',
  ],
  authors: [{ name: 'RIIQX Division' }],
  creator: 'RIIQX Cybernetic Luxury',
  openGraph: {
    title: 'RIIQX — Cybernetic Luxury Streetwear',
    description:
      'High-performance technical streetwear crafted with dark obsidian aesthetics, magnetic hardware, and heavyweight French Terry.',
    url: baseUrl,
    siteName: 'RIIQX',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'RIIQX Cybernetic Luxury Streetwear',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIIQX — Cybernetic Luxury Streetwear',
    description: 'High-performance technical streetwear crafted with dark obsidian aesthetics.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RIIQX',
  url: baseUrl,
  logo: `${baseUrl}/icon.png`,
  sameAs: [
    'https://instagram.com/riiqx',
    'https://twitter.com/riiqx',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@riiqx.com',
    contactType: 'customer service',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className="bg-obsidian-base text-riiqxText-primary antialiased selection:bg-accent-crimson selection:text-white min-h-screen">
        <JsonLd data={organizationSchema} />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
