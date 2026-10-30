import {notFound} from "next/navigation";
import Link from "next/link";
import {getPosts,renderMarkdown} from "@/lib/blog";
import {profile} from "@/data/site";
import ArticleBody from "@/components/ArticleBody";
export function generateStaticParams(){return getPosts().map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=getPosts().find(p=>p.slug===slug);if(!p)return {};return {title:p.title,description:p.description,alternates:{canonical:`/blog/${slug}`},openGraph:{type:"article",title:p.title,description:p.description,url:`/blog/${slug}`,publishedTime:p.date,modifiedTime:p.updated,authors:[profile.name],tags:p.tags,images:["/opengraph-image"]}}}
export default async function PostPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=getPosts().find(p=>p.slug===slug);if(!p)notFound();return <article className="article page"><Link href="/blog">← All writing</Link><header className="article-header"><p className="eyebrow"><time dateTime={p.date}>{p.date}</time> · {p.readingTime} min read</p><h1>{p.title}</h1><p className="lede">{p.description}</p><p>By {profile.name}{p.updated&&<> · Updated <time dateTime={p.updated}>{p.updated}</time></>}</p>{p.tags.length>0&&<p className="tech">{p.tags.join(" / ")}</p>}</header><ArticleBody html={renderMarkdown(p.body)}/></article>}
