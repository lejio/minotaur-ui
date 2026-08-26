import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Minotaur UI",
  description: "Editorial design system for calm product interfaces",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${newsreader.variable}`}>
      <body
        style={
          {
            "--font-sans": "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
            "--font-serif": "var(--font-newsreader), ui-serif, Georgia, serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
