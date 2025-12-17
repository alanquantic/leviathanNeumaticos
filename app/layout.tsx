import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { GlobalNav } from '@/components/global-nav';
import { LanguageProvider } from '@/lib/i18n/context';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: 'Leviathan OS - Infrastructure-Grade Financial Intelligence',
  description: 'Leviathan OS: Complete financial model for tire recycling plants with CAPEX analysis, cash flow projections, and tokenization framework. Featuring Leviathan Gate for infrastructure-grade project vetting.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Leviathan OS - Infrastructure-Grade Financial Intelligence',
    description: 'Complete financial model for tire recycling plants with Leviathan Gate project vetting system',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <GlobalNav />
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
