import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/languageContext";
import SEOReporter from "@/components/SEOReporter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nalimudheen Wafy | Graphic Designer, Photographer & Media Coordinator in Kerala",
  description: "Professional Graphic Designer and Visual Media Specialist in Kerala specializing in branding, video editing, photography, and institutional media coordination.",
  keywords: ["Graphic Designer Kerala", "Photographer Kerala", "Videographer Kerala", "Media Coordinator Kerala", "Nalimudheen Wafy", "Malappuram Designer"],
  authors: [{ name: "Nalimudheen Wafy" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
        <LanguageProvider>
          <SEOReporter />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
