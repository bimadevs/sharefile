import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Font utama - Outfit untuk judul dan Inter untuk teks biasa
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'] 
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "ShareFile - Berbagi File dengan Mudah dan Cepat",
  description: "Platform berbagi file modern dengan tampilan yang profesional. Upload, bagikan link, dan download file dengan mudah.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
