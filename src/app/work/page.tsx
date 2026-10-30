import ProjectList from "@/components/ProjectList";
import { projects } from "@/data/site";
export const metadata={title:"Work",description:"Selected personal projects and professional ERP engineering work.",alternates:{canonical:"/work"}};
export default function Work(){return <div className="page-width page"><p className="eyebrow">WORK / SELECTED PROJECTS</p><h1>Ideas, implemented.</h1><p className="lede">Personal applications and production engineering, with a clear account of my contribution.</p><ProjectList projects={projects}/></div>}
