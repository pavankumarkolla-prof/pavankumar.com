"use client";

import { FadeIn, AnimatedHeading } from "@/components/ui/animated-text";
import { Spotlight } from "@/components/ui/spotlight";
import { TiltCard } from "@/components/ui/magnetic-button";
import { GitHubIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/data";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, GitFork, ArrowUpRight, Users, BookMarked, Activity } from "lucide-react";

type Profile = {
  name: string | null;
  bio: string | null;
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
};

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

type GhEvent = {
  type: string;
  created_at: string;
};

type Data = {
  profile: Profile;
  repos: Repo[];
  events: GhEvent[];
};

const CACHE_KEY = "gh-stats-v1";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Apex: "#1797c0",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  C: "#555555",
  "C++": "#f34b7d",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
};

function langColor(lang: string) {
  return LANG_COLORS[lang] ?? "#9ca3af";
}

async function fetchGitHub(username: string): Promise<Data> {
  const cached = typeof window !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
  if (cached) {
    try {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return data;
    } catch {}
  }

  const headers = { Accept: "application/vnd.github+json" };
  const [profileRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
  ]);

  if (!profileRes.ok) throw new Error(`GitHub profile fetch failed: ${profileRes.status}`);

  const profile = (await profileRes.json()) as Profile;
  const repos = reposRes.ok ? ((await reposRes.json()) as Repo[]) : [];
  const events = eventsRes.ok ? ((await eventsRes.json()) as GhEvent[]) : [];

  const data: Data = { profile, repos, events };
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch {}
  }
  return data;
}

function useGitHub(username: string) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchGitHub(username)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(String(e?.message ?? e)));
    return () => {
      alive = false;
    };
  }, [username]);

  return { data, error };
}

function buildHeatmap(events: GhEvent[]) {
  const weeks = 20;
  const days = weeks * 7;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const counts = new Array(days).fill(0);

  for (const ev of events) {
    const d = new Date(ev.created_at);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < days) {
      counts[days - 1 - diff] += 1;
    }
  }

  const max = Math.max(1, ...counts);
  return { counts, weeks, max };
}

function cellColor(count: number, max: number) {
  if (count === 0) return "rgba(37, 99, 235, 0.06)";
  const t = Math.min(1, count / max);
  const alpha = 0.18 + t * 0.72;
  return `rgba(37, 99, 235, ${alpha.toFixed(2)})`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function StatBubble({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs">
      <Icon size={12} className="text-primary/70" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <TiltCard className="h-full">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full p-5 rounded-xl border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-500"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookMarked size={14} className="text-primary/70 shrink-0" />
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {repo.name}
            </h3>
          </div>
          <ArrowUpRight
            size={14}
            className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
          />
        </div>
        <p className="text-xs text-foreground/60 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {repo.description ?? "No description provided."}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: langColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star size={11} /> {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={11} /> {repo.forks_count}
          </span>
          <span className="ml-auto text-muted-foreground/60">{timeAgo(repo.pushed_at)}</span>
        </div>
      </a>
    </TiltCard>
  );
}

function LanguageBar({ repos }: { repos: Repo[] }) {
  const totals = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || r.archived || !r.language) continue;
    totals.set(r.language, (totals.get(r.language) ?? 0) + 1);
  }
  const entries = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total = entries.reduce((acc, [, v]) => acc + v, 0) || 1;

  if (entries.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-primary/60">
          Languages
        </h4>
        <span className="text-[11px] text-muted-foreground font-mono">
          by repo count
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        {entries.map(([lang, count]) => (
          <motion.div
            key={lang}
            initial={{ width: 0 }}
            whileInView={{ width: `${(count / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0, 1] }}
            style={{ background: langColor(lang) }}
            title={`${lang}: ${count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {entries.map(([lang, count]) => (
          <span
            key={lang}
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: langColor(lang) }}
            />
            {lang}
            <span className="text-muted-foreground/60">·</span>
            <span className="text-foreground/80">
              {((count / total) * 100).toFixed(0)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Heatmap({ events }: { events: GhEvent[] }) {
  const { counts, weeks, max } = buildHeatmap(events);
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-primary/60 flex items-center gap-2">
          <Activity size={12} />
          Activity · last {weeks} weeks
        </h4>
        <span className="text-[11px] text-muted-foreground font-mono">
          {total} public events
        </span>
      </div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, d) => {
              const idx = w * 7 + d;
              const count = counts[idx];
              return (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (idx / counts.length) * 0.4 }}
                  className="aspect-square rounded-[2px]"
                  style={{ background: cellColor(count, max) }}
                  title={count === 0 ? "No activity" : `${count} event${count === 1 ? "" : "s"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-muted-foreground font-mono">
        <span>less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-[2px]"
            style={{ background: cellColor(Math.ceil(t * max), max) }}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-xl border border-border bg-card/50 animate-pulse"
        />
      ))}
    </div>
  );
}

export function GitHubStats() {
  const { data, error } = useGitHub(siteConfig.githubUsername);

  const topRepos = data
    ? [...data.repos]
        .filter((r) => !r.fork && !r.archived)
        .sort((a, b) => {
          if (b.stargazers_count !== a.stargazers_count)
            return b.stargazers_count - a.stargazers_count;
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        })
        .slice(0, 6)
    : [];

  return (
    <section id="github" className="relative py-28 overflow-hidden">
      <Spotlight />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-3"
          >
            05 / GitHub
          </motion.p>
          <AnimatedHeading className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Live from GitHub</span>
          </AnimatedHeading>
          <FadeIn delay={0.1}>
            <div className="w-14 h-[3px] accent-line mt-4 rounded-full" />
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-5 text-sm text-muted-foreground max-w-xl leading-relaxed">
              Real-time snapshot pulled directly from the GitHub API — repos,
              languages, and public activity. No screenshots, no stale numbers.
            </p>
          </FadeIn>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card text-xs font-mono text-muted-foreground">
            Couldn&apos;t reach GitHub ({error}). Showing nothing — your rate limit
            probably needs a minute.
          </div>
        )}

        {!data && !error && <Skeleton />}

        {data && (
          <>
            <FadeIn delay={0.2}>
              <div className="mb-8 p-5 rounded-xl border border-border bg-card card-elevated flex flex-wrap items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.login}
                  className="w-12 h-12 rounded-full border border-border"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <GitHubIcon size={14} className="text-muted-foreground" />
                    <a
                      href={data.profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
                    >
                      @{data.profile.login}
                    </a>
                  </div>
                  {data.profile.bio && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {data.profile.bio}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatBubble icon={BookMarked} label="Repos" value={data.profile.public_repos} />
                  <StatBubble icon={Users} label="Followers" value={data.profile.followers} />
                  <StatBubble icon={Star} label="Following" value={data.profile.following} />
                </div>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-5 mb-8">
              <FadeIn delay={0.25}>
                <div className="p-5 rounded-xl border border-border bg-card card-elevated h-full">
                  <Heatmap events={data.events} />
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="p-5 rounded-xl border border-border bg-card card-elevated h-full">
                  <LanguageBar repos={data.repos} />
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.35}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-primary/60">
                  Top repositories
                </h4>
                <a
                  href={data.profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  view all <ArrowUpRight size={11} />
                </a>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRepos.map((repo, i) => (
                <FadeIn key={repo.id} delay={0.4 + i * 0.05}>
                  <RepoCard repo={repo} />
                </FadeIn>
              ))}
            </div>

            {topRepos.length === 0 && (
              <div className="p-6 rounded-xl border border-border bg-card text-sm text-muted-foreground text-center">
                No public repositories yet.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
