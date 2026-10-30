import type {MetadataRoute} from "next";
import {profile,projects} from "@/data/site";
import {getPosts} from "@/lib/blog";
export default function sitemap():MetadataRoute.Sitemap{return ["","/work","/about","/blog",...projects.map(p=>`/work/${p.slug}`),...getPosts().map(p=>`/blog/${p.slug}`)].map(path=>({url:profile.url+path}))}
