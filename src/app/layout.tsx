import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { DeveloperToolkit } from "@/components/dev/DeveloperToolkit";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

import { Viewport } from "next";
import { constructMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://type100x.com"),
  ...constructMetadata(),
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans min-h-screen antialiased`} suppressHydrationWarning>
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Type100X",
            "url": "https://type100x.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://type100x.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }} />
          <GoogleAnalytics gaId="G-L8EH506XGP" />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SkipToContent />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <DeveloperToolkit />
          </ThemeProvider>
      </body>
    </html>
  );
}
