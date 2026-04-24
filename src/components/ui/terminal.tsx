"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";
import { siteConfig, skills, projects, publications, experience } from "@/lib/data";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "err"; text: string };

type CommandFn = (args: string[], ctx: Ctx) => Line[] | Promise<Line[]>;
type Ctx = { clear: () => void; close: () => void };

const BANNER = `\
 ____                         _  __
|  _ \\ __ ___   ____ _ _ __  | |/ /   _ _ __ ___   __ _ _ __
| |_) / _\` \\ \\ / / _\` | '_ \\ | ' / | | | '_ \` _ \\ / _\` | '__|
|  __/ (_| |\\ V / (_| | | | || . \\ |_| | | | | | | (_| | |
|_|   \\__,_| \\_/ \\__,_|_| |_||_|\\_\\__,_|_| |_| |_|\\__,_|_|
`;

function mkCommands(ctx: Ctx): Record<string, { desc: string; run: CommandFn }> {
  const openUrl = (url: string) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  return {
    help: {
      desc: "List available commands",
      run: () => {
        const rows = Object.entries(mkCommands(ctx))
          .map(([name, c]) => `  ${name.padEnd(12)} ${c.desc}`)
          .join("\n");
        return [{ kind: "out", text: `Available commands:\n${rows}` }];
      },
    },
    whoami: {
      desc: "Print a short bio",
      run: () => [
        {
          kind: "out",
          text: `${siteConfig.name} — Software Architect, AI Researcher, Technology Leader.
Builds enterprise-grade systems at the intersection of cloud, AI, and CRM.
Solo operator: architecture → code → deploy.`,
        },
      ],
    },
    skills: {
      desc: "Show technology stack",
      run: () => [
        {
          kind: "out",
          text: skills.map((s) => `  • ${s.name.padEnd(36)} [${s.category}]`).join("\n"),
        },
      ],
    },
    projects: {
      desc: "List active projects",
      run: () => {
        const rows = projects
          .map(
            (p, i) =>
              `  [${i + 1}] ${p.title}\n      ${p.description}\n      tags: ${p.tags.join(", ")}\n      status: ${p.status}`
          )
          .join("\n\n");
        return [{ kind: "out", text: rows || "No projects." }];
      },
    },
    papers: {
      desc: "List publications",
      run: () => {
        const rows = publications
          .map(
            (p, i) =>
              `  [${i + 1}] ${p.title}\n      venue: ${p.venue} (${p.year})\n      status: ${p.status}`
          )
          .join("\n\n");
        return [{ kind: "out", text: rows || "No publications." }];
      },
    },
    experience: {
      desc: "Show work experience",
      run: () => {
        const rows = experience
          .map(
            (e) =>
              `  ${e.role} — ${e.period}\n    ${e.description}\n    highlights:\n${e.highlights
                .map((h) => `      • ${h}`)
                .join("\n")}`
          )
          .join("\n\n");
        return [{ kind: "out", text: rows }];
      },
    },
    github: {
      desc: "Open GitHub profile",
      run: () => {
        openUrl(siteConfig.links.github);
        return [{ kind: "out", text: `opening ${siteConfig.links.github} …` }];
      },
    },
    linkedin: {
      desc: "Open LinkedIn",
      run: () => {
        openUrl(siteConfig.links.linkedin);
        return [{ kind: "out", text: `opening ${siteConfig.links.linkedin} …` }];
      },
    },
    contact: {
      desc: "Show contact info",
      run: () => [
        {
          kind: "out",
          text: `email    ${siteConfig.links.email.replace("mailto:", "")}
github   ${siteConfig.links.github}
linkedin ${siteConfig.links.linkedin}`,
        },
      ],
    },
    email: {
      desc: "Copy email to clipboard",
      run: async () => {
        const email = siteConfig.links.email.replace("mailto:", "");
        try {
          await navigator.clipboard.writeText(email);
          return [{ kind: "out", text: `copied ${email} to clipboard ✓` }];
        } catch {
          return [{ kind: "err", text: `couldn't copy — here's the email: ${email}` }];
        }
      },
    },
    ls: {
      desc: "List sections",
      run: () => [
        {
          kind: "out",
          text: `drwxr-xr-x  hero/
drwxr-xr-x  about/
drwxr-xr-x  experience/
drwxr-xr-x  publications/
drwxr-xr-x  projects/
drwxr-xr-x  github/
drwxr-xr-x  contact/`,
        },
      ],
    },
    cd: {
      desc: "Navigate to a section (e.g. cd about)",
      run: (args) => {
        const target = (args[0] ?? "").replace(/^\/+|\/+$/g, "");
        if (!target) return [{ kind: "err", text: "usage: cd <section>" }];
        const known = ["about", "experience", "publications", "projects", "github", "contact"];
        if (!known.includes(target))
          return [{ kind: "err", text: `no such section: ${target}` }];
        const el = document.getElementById(target);
        el?.scrollIntoView({ behavior: "smooth" });
        ctx.close();
        return [{ kind: "out", text: `navigating to /${target} …` }];
      },
    },
    neofetch: {
      desc: "Show a fancy system card",
      run: () => [
        {
          kind: "out",
          text: `${BANNER}
${siteConfig.name.padEnd(32)}
--------------------------------
os       : macOS · linux · vibes
shell    : pavankumar.sh v2.0
editor   : vscode · vim
langs    : Apex · TypeScript · Python · SOQL
cloud    : AWS · Azure · Salesforce
ai       : Claude · GPT-4 · custom pipelines
role     : Software Architect
mode     : solo operator
uptime   : 8+ years shipping software`,
        },
      ],
    },
    sudo: {
      desc: "It won't work",
      run: () => [
        { kind: "err", text: "pavankumar is not in the sudoers file. This incident will be reported." },
      ],
    },
    clear: {
      desc: "Clear the terminal",
      run: () => {
        ctx.clear();
        return [];
      },
    },
    exit: {
      desc: "Close the terminal",
      run: () => {
        ctx.close();
        return [];
      },
    },
    echo: {
      desc: "Echo input",
      run: (args) => [{ kind: "out", text: args.join(" ") }],
    },
    date: {
      desc: "Print current date",
      run: () => [{ kind: "out", text: new Date().toString() }],
    },
  };
}

const WELCOME: Line[] = [
  { kind: "out", text: BANNER },
  {
    kind: "out",
    text: `Welcome. Type "help" to list commands, "whoami" for a quick intro, or "neofetch" for a system card.`,
  },
];

export function Terminal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number | null>(null);
  const [maximized, setMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const clear = useCallback(() => setLines([]), []);

  const commands = useMemo(() => mkCommands({ clear, close }), [clear, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const runCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory((h) => [...h, trimmed]);
    setHIdx(null);

    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = commands[name.toLowerCase()];

    const prompt: Line = { kind: "cmd", text: trimmed };
    setLines((ls) => [...ls, prompt]);

    if (!cmd) {
      setLines((ls) => [
        ...ls,
        { kind: "err", text: `command not found: ${name}. Type "help" for a list.` },
      ]);
      return;
    }

    try {
      const out = await cmd.run(args, { clear, close });
      if (out.length) setLines((ls) => [...ls, ...out]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLines((ls) => [...ls, { kind: "err", text: `error: ${msg}` }]);
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      setInput("");
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = hIdx === null ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === null) return;
      const next = hIdx + 1;
      if (next >= history.length) {
        setHIdx(null);
        setInput("");
      } else {
        setHIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const q = input.toLowerCase();
      const match = Object.keys(commands).filter((k) => k.startsWith(q));
      if (match.length === 1) setInput(match[0] + " ");
      else if (match.length > 1) {
        setLines((ls) => [...ls, { kind: "out", text: match.join("  ") }]);
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      clear();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-background/60 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.25, 0.4, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#0b0f14] text-[#e6edf3] border border-border rounded-t-xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono ${
              maximized
                ? "w-full h-[90vh] max-w-6xl"
                : "w-full sm:w-[720px] h-[70vh] sm:h-[520px]"
            }`}
          >
            {/* titlebar */}
            <div
              className="flex items-center gap-2 px-3 h-9 border-b border-white/10 bg-[#11161d]"
              onDoubleClick={() => setMaximized((m) => !m)}
            >
              <div className="flex items-center gap-1.5">
                <button
                  onClick={close}
                  aria-label="Close terminal"
                  className="w-3 h-3 rounded-full bg-red-500/90 hover:bg-red-400 transition-colors flex items-center justify-center group"
                >
                  <X size={7} className="text-red-900 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={close}
                  aria-label="Minimize"
                  className="w-3 h-3 rounded-full bg-yellow-500/90 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                >
                  <Minus size={7} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={() => setMaximized((m) => !m)}
                  aria-label="Maximize"
                  className="w-3 h-3 rounded-full bg-green-500/90 hover:bg-green-400 transition-colors flex items-center justify-center group"
                >
                  <Maximize2 size={6} className="text-green-900 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
              <div className="flex-1 text-center text-[11px] text-white/50 select-none">
                pavankumar@web — zsh — {maximized ? "fullscreen" : "80×24"}
              </div>
              <div className="w-[58px]" />
            </div>

            {/* body */}
            <div
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-relaxed"
            >
              {lines.map((line, i) => {
                if (line.kind === "cmd") {
                  return (
                    <div key={i} className="flex gap-2">
                      <span className="text-emerald-400/90 shrink-0">
                        pavan@site <span className="text-white/30">~</span> $
                      </span>
                      <span className="text-white/90 whitespace-pre-wrap break-words">
                        {line.text}
                      </span>
                    </div>
                  );
                }
                if (line.kind === "err") {
                  return (
                    <pre
                      key={i}
                      className="text-red-400/90 whitespace-pre-wrap break-words"
                    >
                      {line.text}
                    </pre>
                  );
                }
                return (
                  <pre
                    key={i}
                    className="text-white/75 whitespace-pre-wrap break-words"
                  >
                    {line.text}
                  </pre>
                );
              })}

              {/* live input line */}
              <div className="flex gap-2 mt-1">
                <span className="text-emerald-400/90 shrink-0">
                  pavan@site <span className="text-white/30">~</span> $
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="flex-1 bg-transparent outline-none text-white/90 caret-emerald-400"
                />
              </div>
            </div>

            {/* footer */}
            <div className="px-3 h-7 border-t border-white/10 bg-[#11161d] flex items-center gap-4 text-[10px] text-white/40">
              <span>
                <kbd className="px-1 rounded bg-white/5 border border-white/10">tab</kbd>{" "}
                complete
              </span>
              <span>
                <kbd className="px-1 rounded bg-white/5 border border-white/10">↑↓</kbd>{" "}
                history
              </span>
              <span>
                <kbd className="px-1 rounded bg-white/5 border border-white/10">esc</kbd>{" "}
                close
              </span>
              <span className="ml-auto">type <span className="text-emerald-400/80">help</span></span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
