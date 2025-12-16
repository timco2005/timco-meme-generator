import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'TIMCO CREATIVE GROUP - Meme Generator',
  description: 'Create custom memes with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}

