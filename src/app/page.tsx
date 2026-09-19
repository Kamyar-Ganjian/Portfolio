import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import About from "@/components/About";
import Experience from "@/components/Experience";
import MAMGallery from "@/components/MAMGallery";
import Architecture from "@/components/Architecture";
import ErpDomains from "@/components/ErpDomains";
import IndustrialIntegration from "@/components/IndustrialIntegration";
import SharedPackages from "@/components/SharedPackages";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Direction from "@/components/Direction";
import Courses from "@/components/Courses";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <About />
      <Experience />
      <MAMGallery />
      <Architecture />
      <ErpDomains />
      <IndustrialIntegration />
      <SharedPackages />
      <Skills />
      <Education />
      <Direction />
      <Courses />
      <Contact />
    </>
  );
}