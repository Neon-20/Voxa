import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';
import { OAuthLoading } from '@/components/auth/oauth-loading';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voxa - Voice AI Mock Interview Practice",
  description: "Master your interview skills with AI-powered voice mock interviews. Practice with realistic questions and get instant feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Suspense fallback={null}>
            <OAuthLoading />
          </Suspense>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
