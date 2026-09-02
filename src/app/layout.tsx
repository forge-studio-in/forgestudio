import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge Studio — Coming Soon | Software, Web, Design & Media",
  description: "Forge Studio is a creative technology studio building software, websites, brands, media, and digital growth solutions. Something powerful is coming soon.",
  keywords: "forge studio, software development, web design, digital media, coming soon",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Forge Studio — Coming Soon",
    description: "We are crafting digital experiences that lift brands to new heights.",
    url: "https://forgestudio.in",
    siteName: "Forge Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
