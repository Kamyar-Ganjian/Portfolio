import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Kamyar Ganjian — Frontend Engineer | React · Next.js · TypeScript",
  description:
    "Frontend Engineer building enterprise software with React, Next.js, and TypeScript — 25 production applications, multi-zone architecture, industrial integrations, and a Master's in AI Engineering.",
  keywords: [
    "Kamyar Ganjian",
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Enterprise Software",
    "AI Engineering",
  ],
  authors: [{ name: profile.personal.name }],
  openGraph: {
    title: "Kamyar Ganjian — Frontend Engineer",
    description:
      "Enterprise frontend engineering with React, Next.js, and TypeScript. 25 production applications, industrial integrations, and a Master's in AI Engineering.",
    type: "website",
    url: "http://localhost:3000",
    siteName: "Kamyar Ganjian",
    images: [{ url: "/images/profile-2.png", width: 1200, height: 1500, alt: "Kamyar Ganjian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamyar Ganjian — Frontend Engineer",
    description:
      "Enterprise frontend engineering with React, Next.js, and TypeScript.",
    images: ["/images/profile-2.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="ambient" aria-hidden="true">
          <div className="glow" />
          <div className="grain" />
        </div>
        <Navigation />
          <MotionProvider>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </MotionProvider>
          <Footer />
      </body>
    </html>
  );
}