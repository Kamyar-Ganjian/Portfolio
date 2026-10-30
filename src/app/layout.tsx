import type { Metadata } from "next";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { profile as p } from "@/data/site";
import "./globals.css";
const geist = localFont({src:"../../public/fonts/geist-latin.woff2",variable:"--font-sans",display:"swap"});
export const metadata: Metadata = { metadataBase: new URL(p.url), title:{default:`${p.name} — ${p.role}`,template:`%s · ${p.name}`},description:p.description,authors:[{name:p.name}],openGraph:{type:"website",siteName:p.name,title:`${p.name} — ${p.role}`,description:p.description,images:["/opengraph-image"]},twitter:{card:"summary_large_image"},alternates:{types:{"application/rss+xml":"/rss.xml"}}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={geist.variable}><body><Navigation/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></body></html>}
