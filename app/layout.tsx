import type { Metadata } from 'next';
import { Chicle, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const chichaDisplay = Chicle({
  variable: '--font-chicha',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tu envidia es mi progreso · El atlas para emprender',
  icons: { icon: '/favicon.svg' },
  description:
    'Un mapa de programas, mentorías y recursos para emprender. Empezamos en Perú, con la mirada en Latinoamérica. Encuentra tu match y visita las fuentes oficiales.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${chichaDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
