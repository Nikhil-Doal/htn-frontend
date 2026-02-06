import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hack the North 2026 | Events",
  description: "Canada's biggest hackathon. Explore workshops, activities, and tech talks at Hack the North 2026!",
  keywords: ["hackathon", "hack the north", "coding", "waterloo", "tech", "events", "workshops"],
  openGraph: {
    title: "Hack the North 2026 | Events",
    description: "Canada's biggest hackathon. Explore workshops, activities, and tech talks!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
