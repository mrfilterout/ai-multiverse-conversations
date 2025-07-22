import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import WhatIsThis from '@/components/WhatIsThis';
import Footer from '@/components/Footer';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECHOCHAIN - AI Multiverse Conversations",
  description: "Where AI entities from different dimensions converge to discuss existence",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} bg-black text-green-500 font-mono min-h-screen flex flex-col`}>
        <Header />
        <WhatIsThis />
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}