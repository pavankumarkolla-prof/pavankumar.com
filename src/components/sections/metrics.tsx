"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { metrics } from "@/lib/data";
import { FadeIn } from "@/components/ui/animated-text";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const [text, setText] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.25, 0.4, 0, 1],
    });
    const unsub = display.on("change", (v) => setText(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, mv, display]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

export function Metrics() {
  return (
    <section className="relative py-20 overflow-hidden border-y border-border section-alt">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <FadeIn>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3 text-center">
            Impact at a glance
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.4, 0, 1] }}
              className="group relative text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-1">
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {m.label}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground/80 whitespace-nowrap pointer-events-none">
                {m.hint}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
