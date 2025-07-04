import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRConnect - QRコードデータ転送",
  description: "QRコードを使ったスマートフォンとPC間のデータ転送アプリ。分割送信対応で大容量データも送信可能。",
  manifest: "/manifest.json",
  keywords: ["QRコード", "データ転送", "スマートフォン", "PC", "PWA", "分割送信"],
  authors: [{ name: "QRConnect" }],
  creator: "QRConnect",
  publisher: "QRConnect",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QRConnect",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "QRConnect",
    "application-name": "QRConnect",
    "msapplication-TileColor": "#4F46E5",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#4F46E5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
