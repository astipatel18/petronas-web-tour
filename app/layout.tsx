import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import { Metadata } from 'next';

// 1. Optimized fonts - Loaded globally via CSS variables
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

// 2. Global Production-ready Metadata
export const metadata: Metadata = {
  title: {
    default: 'Petronas Twin Towers | Experience the Sky Above the City',
    template: '%s | Petronas Twin Towers'
  },
  description: 'Official digital platform for Petronas Twin Towers. Book tickets for the Skybridge and Observation Deck.',
  keywords: ['Petronas Twin Towers', 'Kuala Lumpur Tourism', 'Skybridge Tickets', 'Observation Deck'],
  authors: [{ name: 'Petronas Management' }],
  openGraph: {
    title: 'Petronas Twin Towers Official Experience',
    description: 'A journey above the clouds in the heart of Malaysia.',
    url: 'https://petronas-web.vercel.app',
    siteName: 'Petronas Twin Towers',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1528181304800-2f140819ad1c',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_MY',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-slate-950 text-slate-200 antialiased`} 
        suppressHydrationWarning
      >
        {/* 
            The Providers component wraps the entire app to handle 
            Auth sessions and Framer Motion exit animations globally.
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}