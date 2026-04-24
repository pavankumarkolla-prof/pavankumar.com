# pavankumar.com

Personal site for **Pavan Kumar Kolla** — Software Architect, AI Researcher, Technology Leader.

Next.js 16 · React 19 · Tailwind v4 · Framer Motion · TypeScript · static export to GitHub Pages.

## Sections (in order)

1. **Hero** — name, subtitle, social links, particle field background.
2. **Impact metrics band** — six animated counters (years, systems shipped, orgs, papers, automations, ownership). Edit values in `src/lib/data.ts` → `metrics`.
3. **About** — bio + skills list.
4. **Experience** — roles and highlights.
5. **Publications** — paper list with abstracts.
6. **Projects** — active and in-progress work.
7. **GitHub** — live data pulled from the GitHub REST API: profile card, activity heatmap (20 weeks, built from `/events/public`), language breakdown across non-fork repos, top 6 repos by stars. Results cached in `sessionStorage` for 1 hour so the 60-req/hr unauth limit is never an issue.
8. **Contact** — email + socials.

## Interactive shell

Every page has a persistent overlay shell (see `src/components/ui/overlay-shell.tsx`) that adds:

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Command palette — fuzzy search over navigation, actions, and links |
| `⌘J` / `` ` `` | Interactive terminal (REPL) |
| `Esc` | Close either overlay |

**Command palette** (`src/components/ui/command-palette.tsx`) groups entries into Navigate / Actions / Links. Supports ↑↓, Enter, hover selection, and live query filtering with token matching.

**Terminal** (`src/components/ui/terminal.tsx`) — a real-ish shell with command history (`↑`/`↓`), tab completion, `Ctrl+L` clear, and commands:

```
help whoami skills projects papers experience
github linkedin contact email
ls cd <section>
neofetch sudo echo date clear exit
```

Floating dock in the bottom-right exposes both without needing to know the shortcut.

## Scripts

```bash
npm run dev     # dev server (Turbopack)
npm run build   # static export → ./out
npm run lint    # eslint
```

## Deploy

```bash
# Preview at pavankumarkolla-prof.github.io/pavankumar.com/
PAGES_PREVIEW=1 npm run build

# Production at https://pavankumar.com (no basePath)
npm run build
```

`next.config.ts` sets `output: "export"`, so `./out` is a fully static site. Any dynamic behaviour (GitHub fetch, palette, terminal) is client-only.

## Where to edit

| Change | File |
| --- | --- |
| Bio, socials, nav, metrics, skills, experience, publications, projects | `src/lib/data.ts` |
| GitHub username | `siteConfig.githubUsername` in `src/lib/data.ts` |
| Colors / gradients / card shadow | `src/app/globals.css` |
| Add a new terminal command | `mkCommands` in `src/components/ui/terminal.tsx` |
| Add a palette entry | `commands` array in `src/components/ui/command-palette.tsx` |
