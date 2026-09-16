import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pan-India Sales Analytics Engine | GSTIN Verified & ML Forecasting",
  description:
    "End-to-end transactional intelligence for registered Indian retail businesses with 15-char GSTIN verification and self-trained machine learning time-series forecasting.",
  icons: {
    icon: "/images/app-logo-square.png",
    apple: "/images/app-logo-square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${newsreader.variable} font-sans bg-[#0A0E12] text-[#EDE6D9] antialiased selection:bg-[#D9A15B] selection:text-[#0A0E12]`}
      >
        {children}
      </body>
    </html>
  );
}
