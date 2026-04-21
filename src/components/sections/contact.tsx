"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/lib/data";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative py-28">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
        >
          05 / Contact
        </motion.p>
        <AnimatedHeading className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="text-gradient">Get In Touch</span>
        </AnimatedHeading>

        <FadeIn delay={0.1}>
          <div className="w-14 h-[3px] accent-line mx-auto mb-8 rounded-full" />
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-foreground/60 text-[15px] leading-relaxed mb-10">
            Whether you want to discuss research collaboration, enterprise
            architecture, or just connect -- my inbox is always open.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <MagneticButton strength={20}>
            <a
              href={siteConfig.links.email}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition-all duration-300"
            >
              <Mail size={16} />
              Email Me
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
