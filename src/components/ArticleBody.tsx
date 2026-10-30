"use client";
import {useRef,useState,useEffect} from "react";
export default function ArticleBody({html}:{html:string}){
 const ref=useRef<HTMLDivElement>(null);const [status,setStatus]=useState("");
 useEffect(()=>{const buttons:HTMLButtonElement[]=[];ref.current?.querySelectorAll("pre").forEach(pre=>{const button=document.createElement("button");button.textContent="Copy code";button.className="copy-code";button.type="button";button.onclick=async()=>{try{await navigator.clipboard.writeText(pre.querySelector("code")?.textContent??"");setStatus("Code copied to clipboard.")}catch{setStatus("Copy unavailable. Select and copy the code manually.")}};pre.append(button);buttons.push(button)});return ()=>buttons.forEach(b=>b.remove())},[html]);
 return <><div className="copy-tools"><span role="status" aria-live="polite">{status}</span></div><div ref={ref} className="prose" dangerouslySetInnerHTML={{__html:html}}/></>
}
