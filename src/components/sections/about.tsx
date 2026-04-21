"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { Spotlight } from "@/components/ui/spotlight";
import { skills } from "@/lib/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function SkillBar({
  name,
  category,
  index,
}: {
  name: string;
  category: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-300 cursor-default"
    >
      <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(37,99,235,0.3)] transition-all" />
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <span className="text-[11px] text-muted-foreground/50 font-mono uppercase tracking-wider">
        {category}
      </span>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-28 overflow-hidden">
      <Spotlight />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
          >
            01 / About
          </motion.p>
          <AnimatedHeading className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">About Me</span>
          </AnimatedHeading>
          <FadeIn delay={0.1}>
            <div className="w-14 h-[3px] accent-line mt-4 rounded-full" />
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-5">
            <FadeIn delay={0.15}>
              <p className="text-foreground/70 leading-[1.8] text-[15px]">
                I&apos;m a Software Architect and Technology Leader who designs
                and builds enterprise systems that bridge cloud platforms,
                AI-driven automation, and large-scale CRM architectures. My work
                spans the full stack of modern enterprise technology -- from
                Salesforce platform engineering and multi-org architecture to
                applied AI research in manufacturing operations and cost
                optimization.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-foreground/70 leading-[1.8] text-[15px]">
                My current research focuses on how AI, cloud services, and
                customer-operations technology platforms can reduce operational
                cost-to-serve and support U.S. manufacturing reshoring -- a
                domain where enterprise software expertise meets industrial-scale
                impact.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <p className="text-foreground/70 leading-[1.8] text-[15px]">
                As a solo architect and product manager, I operate across the
                full lifecycle -- from requirements and stakeholder alignment
                through architecture, implementation, and production deployment.
                This dual perspective shapes both my engineering approach
                (pragmatic, production-first) and my research methodology
                (empirical, grounded in real systems).
              </p>
            </FadeIn>
          </div>

          <div className="lg:col-span-2">
            <FadeIn delay={0.2}>
              <h3 className="text-xs uppercase tracking-[0.15em] text-primary/60 mb-5 font-mono">
                Technologies & Domains
              </h3>
            </FadeIn>
            <div className="space-y-2.5">
              {skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  category={skill.category}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
