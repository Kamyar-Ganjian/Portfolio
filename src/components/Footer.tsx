import Link from "next/link";
import { profile as p } from "@/data/site";
export default function Footer(){return <footer className="page-width" id="contact"><div><p className="eyebrow">LET’S TALK</p><a className="contact-email" href={`mailto:${p.email}`}>{p.email}</a><p>Babol, Iran · Open to relocation.</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kamyar Ganjian</span><div className="links"><a href={p.github}>GitHub ↗</a><a href={p.linkedin}>LinkedIn ↗</a><a href={p.resume} download>Résumé (PDF) ↓</a><Link href="/blog/feed">RSS feed</Link></div></div></footer>}
