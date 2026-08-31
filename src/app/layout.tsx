import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import AppLayout from "@/app/components/AppLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js App with Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex h-full bg-white text-[#171717] font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
