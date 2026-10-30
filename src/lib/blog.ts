import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
export type Post = {slug:string;title:string;description:string;date:string;updated?:string;tags:string[];draft:boolean;body:string;readingTime:number};
export function parsePost(filename:string,source:string):Post {
 const fail=(message:string):never=>{throw new Error(`Blog ${filename}: ${message}`)};
 const slug=filename.replace(/\.md$/,"");if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))fail("use a lowercase, hyphenated .md filename");
 const {data,content}=matter(source);
 for(const key of ["title","description"])if(typeof data[key]!=="string"||!data[key].trim())fail(`${key} must be a non-empty string`);
 const date=(key:string,required:boolean)=>{const value=data[key];if(value===undefined&&!required)return undefined;if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)fail(`${key} must be a quoted valid YYYY-MM-DD date`);return value as string};
 if(data.draft!==undefined&&typeof data.draft!=="boolean")fail("draft must be true or false");
 if(data.tags!==undefined&&(!Array.isArray(data.tags)||data.tags.some((t:unknown)=>typeof t!=="string")))fail("tags must be a list of strings");
 if(data.slug!==undefined)fail("slugs come from filenames; remove the slug field");
 const published=date("date",true)!;const updated=date("updated",false);if(updated&&updated<published)fail("updated cannot precede date");
 return {slug,title:data.title,description:data.description,date:published,updated,tags:data.tags??[],draft:data.draft??false,body:content,readingTime:Math.max(1,Math.ceil(content.split(/\s+/).length/220))};
}
export function isPublished(post:Post,now=new Date()){return !post.draft&&post.date<=now.toISOString().slice(0,10)}
export function getPosts(){const dir=path.join(process.cwd(),"content/blog");return fs.readdirSync(dir).filter(f=>f.endsWith(".md")).map(f=>parsePost(f,fs.readFileSync(path.join(dir,f),"utf8"))).filter(p=>isPublished(p)).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug))}
export function renderMarkdown(body:string){
 const md=new MarkdownIt({html:false,linkify:true,highlight:(code,lang)=>{return lang&&hljs.getLanguage(lang)?hljs.highlight(code,{language:lang}).value: new MarkdownIt().utils.escapeHtml(code)}});
 const originalImage=md.renderer.rules.image!;
 md.renderer.rules.image=(tokens,index,options,env,self)=>{
  const token=tokens[index];token.attrSet("loading","lazy");token.attrSet("decoding","async");
  const src=String(token.attrGet("src")??"");
  if(src.startsWith("/")&&!src.startsWith("//")){
   const publicDir=path.resolve(process.cwd(),"public");const imagePath=path.resolve(publicDir,"."+src);
   if(imagePath.startsWith(publicDir+path.sep)&&fs.existsSync(imagePath)&&src.endsWith(".png")){
    const buffer=fs.readFileSync(imagePath);if(buffer.length>24&&buffer.toString("hex",0,8)==="89504e470d0a1a0a"){token.attrSet("width",String(buffer.readUInt32BE(16)));token.attrSet("height",String(buffer.readUInt32BE(20)))}
   }
  }
  return originalImage(tokens,index,options,env,self);
 };
 const used=new Map<string,number>();
 md.renderer.rules.heading_open=(tokens,index)=>{const text=tokens[index+1].content;const base=text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"")||"section";const count=used.get(base)??0;used.set(base,count+1);const id=count?`${base}-${count}`:base;const tag=tokens[index].tag;return `<${tag} id="${id}"><a class="heading-anchor" href="#${id}">`};
 md.renderer.rules.heading_close=(tokens,index)=>`</a></${tokens[index].tag}>`;
 return md.render(body);
}
export function xml(value:string){return value.replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]!))}
