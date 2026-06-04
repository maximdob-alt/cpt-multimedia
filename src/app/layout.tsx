import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aetheric Strands — An Interactive Editorial",
  description: "An immersive, dark-mode editorial exploring media strand integration, perspective philosophy, and text-to-world systems with scroll-linked animations and synthesized audio contexts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#121212] text-zinc-300 font-sans selection:bg-white/20 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
