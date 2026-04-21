"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { experience } from "@/lib/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";

export function Experience() {
  const lineRef = useRef(null);
  const isInView = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="relative py-28 section-alt">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
          >
            02 / Experience
          </motion.p>
          <AnimatedHeading className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Experience</span>
          </AnimatedHeading>
          <FadeIn delay={0.1}>
            <div className="w-14 h-[3px] accent-line mt-4 rounded-full" />
          </FadeIn>
        </div>

        <div ref={lineRef} className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-[19px] top-0 bottom-0 w-[2px] origin-top accent-line rounded-full"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.4, 0, 1] }}
          />

          {experience.map((exp, i) => (
            <FadeIn key={i} delay={0.2 + i * 0.15}>
              <div className="relative pl-14 pb-12 last:pb-0">
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-0 top-1 w-10 h-10 rounded-full border-2 border-primary/20 bg-background flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15, type: "spring" }}
                >
                  <Briefcase size={16} className="text-primary" />
                </motion.div>

                {/* Card */}
                <div className="group p-6 rounded-xl border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                    <span className="text-sm text-primary font-mono mt-1 sm:mt-0">{exp.period}</span>
                  </div>

                  <p className="text-foreground/60 text-sm leading-relaxed mb-4">{exp.description}</p>

                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, j) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-foreground/60"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.5 + j * 0.08 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                        {highlight}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
