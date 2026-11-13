import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSupport from '@/components/layout/FloatingSupport';
import { ToastProvider } from '@/components/ui/ToastNotifications';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'ReGear | Certified Pre-Owned & Refurbished Electronics Marketplace',
  description:
    'Good tech. Better prices. Discover, buy, and sell certified refurbished smartphones, laptops, monitors, gaming consoles, and tech accessories with 100% verified diagnostics.',
  keywords: [
    'refurbished electronics',
    'pre-owned laptops',
    'used smartphones',
    'refurbished macbook',
    'regear marketplace',
    'eco tech',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <ToastProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
          <FloatingSupport />
        </ToastProvider>
      </body>
    </html>
  );
}
