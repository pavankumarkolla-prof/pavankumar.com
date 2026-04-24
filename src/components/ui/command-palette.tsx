"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  ArrowRight,
  User,
  Briefcase,
  BookOpen,
  Sparkles,
  Mail,
  Terminal as TerminalIcon,
  FileText,
  Copy,
  CornerDownLeft,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/data";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Links";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  keywords?: string[];
  run: () => void;
};

function Panel({
  onClose,
  onOpenTerminal,
}: {
  onClose: () => void;
  onOpenTerminal: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const goto = (href: string) => {
    onClose();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.location.hash = href;
  };

  const openUrl = (url: string) => {
    onClose();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    const email = siteConfig.links.email.replace("mailto:", "");
    try {
      await navigator.clipboard.writeText(email);
    } catch {}
    onClose();
  };

  const commands: Command[] = useMemo(
    () => [
      {
        id: "nav-about",
        label: "Go to About",
        hint: "#about",
        group: "Navigate",
        icon: User,
        keywords: ["bio", "intro"],
        run: () => goto("#about"),
      },
      {
        id: "nav-experience",
        label: "Go to Experience",
        hint: "#experience",
        group: "Navigate",
        icon: Briefcase,
        keywords: ["work", "career", "jobs"],
        run: () => goto("#experience"),
      },
      {
        id: "nav-publications",
        label: "Go to Publications",
        hint: "#publications",
        group: "Navigate",
        icon: BookOpen,
        keywords: ["papers", "research"],
        run: () => goto("#publications"),
      },
      {
        id: "nav-projects",
        label: "Go to Projects",
        hint: "#projects",
        group: "Navigate",
        icon: Sparkles,
        keywords: ["portfolio", "work"],
        run: () => goto("#projects"),
      },
      {
        id: "nav-github",
        label: "Go to GitHub stats",
        hint: "#github",
        group: "Navigate",
        icon: GitHubIcon,
        keywords: ["repos", "code", "activity"],
        run: () => goto("#github"),
      },
      {
        id: "nav-contact",
        label: "Go to Contact",
        hint: "#contact",
        group: "Navigate",
        icon: Mail,
        keywords: ["email", "reach"],
        run: () => goto("#contact"),
      },
      {
        id: "open-terminal",
        label: "Open terminal",
        hint: "interactive REPL",
        group: "Actions",
        icon: TerminalIcon,
        keywords: ["shell", "cli", "console"],
        run: () => {
          onClose();
          onOpenTerminal();
        },
      },
      {
        id: "copy-email",
        label: "Copy email to clipboard",
        hint: siteConfig.links.email.replace("mailto:", ""),
        group: "Actions",
        icon: Copy,
        keywords: ["contact", "mail"],
        run: copyEmail,
      },
      {
        id: "open-resume",
        label: "Email me directly",
        hint: "compose new message",
        group: "Actions",
        icon: FileText,
        keywords: ["cv", "resume", "mail"],
        run: () => {
          onClose();
          window.location.href = siteConfig.links.email;
        },
      },
      {
        id: "link-github",
        label: "Open GitHub profile",
        hint: siteConfig.links.github,
        group: "Links",
        icon: GitHubIcon,
        run: () => openUrl(siteConfig.links.github),
      },
      {
        id: "link-linkedin",
        label: "Open LinkedIn",
        hint: siteConfig.links.linkedin,
        group: "Links",
        icon: LinkedInIcon,
        run: () => openUrl(siteConfig.links.linkedin),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const hay =
        c.label.toLowerCase() +
        " " +
        (c.hint ?? "").toLowerCase() +
        " " +
        (c.keywords ?? []).join(" ").toLowerCase() +
        " " +
        c.group.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [commands, query]);

  const grouped = useMemo(() => {
    const g: Record<string, Command[]> = {};
    for (const c of filtered) {
      g[c.group] = g[c.group] ?? [];
      g[c.group].push(c);
    }
    return g;
  }, [filtered]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[active]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, active, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-border bg-muted text-muted-foreground">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No matches for{" "}
              <span className="font-mono text-foreground">{query}</span>
            </div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="py-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                {group}
              </div>
              {items.map((cmd) => {
                const idx = filtered.indexOf(cmd);
                const isActive = idx === active;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    data-idx={idx}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => cmd.run()}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-primary/5 text-foreground"
                        : "text-foreground/80 hover:bg-muted/40"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={isActive ? "text-primary" : "text-muted-foreground"}
                    />
                    <span className="flex-1 truncate">{cmd.label}</span>
                    {cmd.hint && (
                      <span className="text-[11px] font-mono text-muted-foreground/70 truncate max-w-[40%]">
                        {cmd.hint}
                      </span>
                    )}
                    {isActive && (
                      <ArrowRight size={12} className="text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-3 h-9 border-t border-border bg-muted/30 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded border border-border bg-card">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded border border-border bg-card">
                <CornerDownLeft size={9} />
              </kbd>
              select
            </span>
          </div>
          <span>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenTerminal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenTerminal: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <Panel onClose={() => onOpenChange(false)} onOpenTerminal={onOpenTerminal} />
      )}
    </AnimatePresence>
  );
}
