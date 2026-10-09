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
  metadataBase: new URL("https://kamyar-ganjian-portfolio.vercel.app"),
  title: "Kamyar Ganjian — Full-Stack Software Engineer",
  description:
    "Full-stack software engineer with a frontend foundation. Production systems, thoughtful product engineering, and a growing focus on AI and machine learning.",
  keywords: [
    "Kamyar Ganjian",
    "Full-Stack Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "C#",
    ".NET",
    "Python",
    "Machine Learning",
    "Enterprise Software",
    "AI Engineering",
  ],
  authors: [{ name: profile.personal.name }],
  openGraph: {
    title: "Kamyar Ganjian — Full-Stack Software Engineer",
    description:
      "Production software engineering, frontend architecture, backend systems, and a Master's in Artificial Intelligence Engineering.",
    type: "website",
    url: "https://kamyar-ganjian-portfolio.vercel.app",
    siteName: "Kamyar Ganjian",
    images: [{ url: "/images/profile-2.png", width: 883, height: 883, alt: "Kamyar Ganjian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamyar Ganjian — Full-Stack Software Engineer",
    description:
      "Full-stack software engineering, frontend architecture, and AI & machine learning.",
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
        <Navigation />
        <main id="main-content" className="flex-1">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
