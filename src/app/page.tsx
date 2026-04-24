import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Metrics } from "@/components/sections/metrics";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Publications } from "@/components/sections/publications";
import { Projects } from "@/components/sections/projects";
import { GitHubStats } from "@/components/sections/github-stats";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { OverlayShell } from "@/components/ui/overlay-shell";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <About />
        <Experience />
        <Publications />
        <Projects />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
      <OverlayShell />
    </>
  );
}
