"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { TiltCard } from "@/components/ui/magnetic-button";
import { publications } from "@/lib/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, ExternalLink, Code2 } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
    submitted: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles["in-progress"]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status === "in-progress"
        ? "In Progress"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function Publications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="publications" className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
          >
            03 / Research
          </motion.p>
          <AnimatedHeading className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Publications & Research</span>
          </AnimatedHeading>
          <FadeIn delay={0.1}>
            <div className="w-14 h-[3px] accent-line mt-4 rounded-full" />
          </FadeIn>
        </div>

        <div ref={ref} className="grid gap-5">
          {publications.map((pub, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.1}>
              <TiltCard>
                <div className="group relative p-6 sm:p-7 rounded-xl border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-500 overflow-hidden">
                  {/* Top gradient line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] accent-line"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  />

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
                      <BookOpen size={18} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                          {pub.title}
                        </h3>
                        <StatusBadge status={pub.status} />
                      </div>

                      <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                        <span className="font-mono text-xs">{pub.venue}</span>
                        <span className="text-border">|</span>
                        <span className="text-xs">{pub.year}</span>
                      </div>

                      <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                        {pub.abstract}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {pub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-primary/5 text-primary/70 border border-primary/10"
                          >
                            {tag}
                          </span>
                        ))}

                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink size={12} /> DOI
                          </a>
                        )}
                        {pub.code && (
                          <a
                            href={pub.code}
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            <Code2 size={12} /> Code
                          </a>
                        )}
                      </div>
                    </div>
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
