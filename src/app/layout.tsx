import type { Metadata } from "next";
import "./globals.css";

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
        className="font-sans bg-[#0A0E12] text-[#EDE6D9] antialiased selection:bg-[#D9A15B] selection:text-[#0A0E12]"
      >
        {children}
      </body>
    </html>
  );
}
