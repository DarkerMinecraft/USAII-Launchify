import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "FOUNDR — AI Startup Co-Pilot",
  description: "Stress-test your startup idea with AI agents before the market does.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        playfair.variable
      )}
    >
      <body className="h-full flex bg-background text-foreground font-sans overflow-x-auto">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-auto min-w-0">{children}</main>
      </body>
    </html>
  );
}
