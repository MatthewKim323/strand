import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SpriteSheet } from "@/components/ui/Sprite";
import { Chrome } from "@/components/layout/Chrome";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nordwell - AI Data Intelligence Platform",
  description:
    "Nordwell builds a living knowledge graph across every tool in your stack. Ask questions in plain language. Get answers no single source could provide alone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SmoothScroll />
        <SpriteSheet />
        <Chrome />
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
