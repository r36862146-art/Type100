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

export const metadata: Metadata = {
  title: {
    default: "Type100X | The Fastest Typing Practice Platform",
    template: "%s | Type100X"
  },
  description: "Improve your typing speed and accuracy with Type100X. Practice with custom texts, take typing tests, or simulate Indian Government exams like SSC and RRB without any account required.",
  keywords: ["typing practice", "typing test", "wpm", "ssc typing", "rrb typing", "type100x"],
  authors: [{ name: "Type100X Team" }],
  creator: "Type100X",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://type100x.com",
    title: "Type100X | The Fastest Typing Practice Platform",
    description: "Improve your typing speed and accuracy with Type100X. Practice with custom texts or simulate Indian Government exams.",
    siteName: "Type100X",
  },
  twitter: {
    card: "summary_large_image",
    title: "Type100X | The Fastest Typing Practice Platform",
    description: "Improve your typing speed and accuracy with Type100X.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans min-h-screen antialiased`} suppressHydrationWarning>
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
