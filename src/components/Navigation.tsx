import Link from "next/link";
import { profile } from "@/data/site";
export default function Navigation(){return <><a className="skip-link" href="#main-content">Skip to content</a><header className="site-header"><div className="header-inner"><Link className="wordmark" href="/">Kamyar Ganjian<span className="wordmark-dot" aria-hidden="true">.</span></Link><nav aria-label="Main navigation"><Link href="/work">Work</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><a href={profile.resume} download>Résumé <span aria-hidden="true">↓</span></a></nav></div></header></>}
