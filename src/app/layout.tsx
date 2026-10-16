import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { site } from "@/data/portfolio";
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
  metadataBase: new URL(site.url),
  title: {
    default: "Kamyar Ganjian — Software Engineer & Full-Stack Developer",
    template: "%s · Kamyar Ganjian",
  },
  description:
    "Software engineer and full-stack developer with production experience across React, Next.js, TypeScript, C#/.NET, enterprise applications, and industrial integrations. M.Sc. Artificial Intelligence Engineering.",
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Kamyar Ganjian — Software Engineer & Full-Stack Developer",
    description:
      "Production engineering across frontend architecture, full-stack software, and industrial integrations.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Kamyar Ganjian · Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamyar Ganjian — Software Engineer & Full-Stack Developer",
    description:
      "Production engineering across frontend architecture, full-stack software, and industrial integrations.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
