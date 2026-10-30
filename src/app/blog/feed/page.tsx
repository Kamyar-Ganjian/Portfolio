import Link from "next/link";
import { profile } from "@/data/site";

export const metadata = {
  title: "Follow the blog via RSS",
  description: "Subscribe to Kamyar Ganjian’s writing using an RSS feed reader.",
  alternates: { canonical: "/blog/feed" },
};

export default function FeedPage() {
  return <div className="article page">
    <Link href="/blog">← Back to the blog</Link>
    <header className="article-header">
      <p className="eyebrow">BLOG / RSS FEED</p>
      <h1>Follow new writing.</h1>
      <p className="lede">RSS lets you receive new blog posts in a feed reader, without an email signup.</p>
    </header>
    <div className="prose">
      <h2>How to subscribe</h2>
      <p>Copy the address below into the subscription field of your preferred RSS reader:</p>
      <p className="feed-address"><code>{profile.url}/rss.xml</code></p>
      <p>Your reader will show new articles after they’re published.</p>
      <h2>Why does the feed look like code?</h2>
      <p>The feed is an XML document designed for RSS readers. Opening it directly in a browser may show its raw text. That’s expected. Until the first article is published, it contains the blog’s information without any article entries.</p>
      <p><a href="/rss.xml">Open the XML feed →</a></p>
    </div>
  </div>;
}
