"use client";

import { motion } from "framer-motion";
import { ParticleField } from "@/components/ui/particle-field";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/lib/data";
import { ArrowDown } from "lucide-react";
import { GitHubIcon, LinkedInIcon, GoogleScholarIcon } from "@/components/ui/icons";

const titleWords = "Pavan Kumar.".split(" ");

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <ParticleField />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-sm mb-6 tracking-widest uppercase font-mono"
        >
          Hi, I&apos;m
        </motion.p>

        {/* Name with gradient */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block text-gradient"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.15,
                ease: [0.25, 0.4, 0, 1],
              }}
            >
              {word}
              {i < titleWords.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </h1>

        {/* Accent line */}
        <motion.div
          className="w-20 h-[3px] accent-line mx-auto mb-6 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.4, 0, 1] }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-lg sm:text-xl text-foreground/70 mb-6 font-medium"
        >
          Software Architect{" "}
          <span className="text-primary">&bull;</span>{" "}
          AI Researcher{" "}
          <span className="text-primary">&bull;</span>{" "}
          Technology Leader
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-muted-foreground max-w-xl mx-auto mb-10 text-[15px] leading-relaxed"
        >
          I design enterprise-grade systems at the intersection of cloud
          platforms, applied AI, and scalable architecture. Currently building
          intelligent automation and publishing research on how AI and cloud
          services can transform U.S. manufacturing.
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex items-center justify-center gap-3"
        >
          {[
            { icon: GitHubIcon, href: siteConfig.links.github, label: "GitHub" },
            { icon: LinkedInIcon, href: siteConfig.links.linkedin, label: "LinkedIn" },
            { icon: GoogleScholarIcon, href: siteConfig.links.scholar, label: "Google Scholar" },
          ].map(({ icon: Icon, href, label }) => (
            <MagneticButton key={label} strength={30}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-border bg-card card-elevated text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            </MagneticButton>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} className="text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
