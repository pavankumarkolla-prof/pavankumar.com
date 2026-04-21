"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { TiltCard } from "@/components/ui/magnetic-button";
import { Spotlight } from "@/components/ui/spotlight";
import { projects } from "@/lib/data";
import { ExternalLink, ArrowUpRight, Zap } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { motion } from "framer-motion";

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500",
    "coming-soon": "bg-amber-400",
  };

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[status]} animate-pulse`} />
      {status === "active" ? "Active" : "Coming Soon"}
    </span>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-28 section-alt overflow-hidden">
      <Spotlight />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
          >
            04 / Projects
          </motion.p>
          <AnimatedHeading className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Projects</span>
          </AnimatedHeading>
          <FadeIn delay={0.1}>
            <div className="w-14 h-[3px] accent-line mt-4 rounded-full" />
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.1}>
              <TiltCard className="h-full">
                <div className="group relative h-full p-6 rounded-xl border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-500 flex flex-col">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Zap size={16} className="text-primary" />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>

                  <StatusDot status={project.status} />

                  <p className="text-sm text-foreground/60 leading-relaxed my-4 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-primary/5 text-primary/70 border border-primary/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <GitHubIcon size={13} /> Source
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={13} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
