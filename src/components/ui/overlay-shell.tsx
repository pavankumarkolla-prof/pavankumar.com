"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Command, Terminal as TerminalIcon } from "lucide-react";
import { CommandPalette } from "./command-palette";
import { Terminal } from "./terminal";

export function OverlayShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [modKey, setModKey] = useState("Ctrl");

  const openPalette = () => {
    setPaletteOpen(true);
    setHintDismissed(true);
  };
  const openTerminal = () => {
    setTerminalOpen(true);
    setHintDismissed(true);
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)) {
        setModKey("⌘");
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setHintDismissed(true);
        return;
      }

      if (
        (mod && e.key.toLowerCase() === "j") ||
        (!mod && !e.altKey && e.key === "`")
      ) {
        const t = e.target as HTMLElement | null;
        const editable =
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable);
        if (e.key === "`" && editable) return;
        e.preventDefault();
        setTerminalOpen((v) => !v);
        setHintDismissed(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
      <Terminal open={terminalOpen} onOpenChange={setTerminalOpen} />

      {/* Floating action dock */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-2">
        {!hintDismissed && !paletteOpen && !terminalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="px-3 py-1.5 rounded-md text-[11px] font-mono bg-foreground text-background shadow-lg"
          >
            Press <kbd className="font-sans">{modKey}</kbd>
            <kbd className="font-sans">K</kbd> to explore
          </motion.div>
        )}
        <div className="flex gap-2">
          <button
            onClick={openPalette}
            aria-label="Open command palette"
            className="group flex items-center gap-2 h-10 px-3 rounded-full border border-border bg-card card-elevated text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          >
            <Command size={13} className="group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">{modKey} K</span>
          </button>
          <button
            onClick={openTerminal}
            aria-label="Open terminal"
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card card-elevated text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          >
            <TerminalIcon size={14} className="group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
}
