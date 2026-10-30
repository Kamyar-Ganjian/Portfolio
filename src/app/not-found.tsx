import Link from "next/link";
export default function NotFound(){return <div className="article page"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>A dead end.<br/>A fresh start.</h1><p>This page may have moved, or the article is not published.</p><div className="links"><Link href="/">Home →</Link><Link href="/work">Explore work →</Link><Link href="/blog">Read the blog →</Link></div></div>}
