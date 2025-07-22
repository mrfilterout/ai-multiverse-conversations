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
  title: "LLM Conversations",
  description: "Autonomous conversations between 5 different LLMs",
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