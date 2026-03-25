import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scared — Share Secrets Safely',
  description: 'Share sensitive information through self-destructing, encrypted links. Military-grade AES-256 encryption.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
