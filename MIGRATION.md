# Migration: pkolla04 → pavankumarkolla-prof

**Date:** 2026-04-21
**Author:** Pavan Kumar Kolla

Record of how `pavankumar.com` moved from the legacy `pkolla04` GitHub account
to the EB-1A-aligned `pavankumarkolla-prof` account, plus the cautions needed
going forward.

---

## TL;DR — Which folder do I edit?

- **`~/pavankumar.com-next/`** → EDIT THIS. Push pushes to `pavankumarkolla-prof/pavankumar.com`. GitHub Actions deploys to Pages automatically on every commit to `main`.
- **`~/pavankumar.com/`** → LEGACY. Do not edit. Remote points to the archived `pkolla04/pavankumar.com`. Safe to delete when you're sure nothing in it is unique.

---

## Why the migration

For the EB-1A green card petition, USCIS reviewers cross-reference the author
name across every piece of evidence — papers, companion repos, website, LinkedIn,
arXiv. Any inconsistency is a red flag.

The old setup had three identities:

| Surface | Old | New |
|---|---|---|
| GitHub account for papers/code | `pkolla04` (reads as "Kolla") | `pavankumarkolla-prof` |
| Website source repo | `pkolla04/pavankumar.com` | `pavankumarkolla-prof/pavankumar.com` |
| Author attribution | "Pavan Kumar" | "Pavan Kumar Kolla" (full legal name) |

Everything public now carries the same full legal name across the same
professional handle. Internal shorthand ("Pavan Kumar" in chat) is unchanged.

---

## What changed — file-level

### New GitHub account
- Account: https://github.com/pavankumarkolla-prof
- Repos:
  - `pavankumarkolla-prof/cascadeflow` — paper companion (public)
  - `pavankumarkolla-prof/pavankumar.com` — this website (public)

### Website repo
- Pushed full source tree, including previously-untracked:
  - `.github/workflows/deploy.yml` (GitHub Pages deploy)
  - `src/components/scroll-progress.tsx`, `smooth-scroll.tsx`
  - `src/components/sections/` (about, contact, etc.)
  - `src/components/ui/` (animated-text, icons, magnetic-button, particle-field, spotlight)
  - `src/lib/data.ts`
- Deploy: GitHub Actions → GitHub Pages (same setup as before, new target repo)
- Build status: https://github.com/pavankumarkolla-prof/pavankumar.com/actions
- Raw Pages URL (works today): https://pavankumarkolla-prof.github.io/pavankumar.com/

### Legacy repo
- `pkolla04/pavankumar.com` → archived with description "DEPRECATED — see github.com/pavankumarkolla-prof/pavankumar.com"
- Not deleted (keeps commit history intact for reference)

---

## DNS — what's still required

The custom domain `pavankumar.com` won't resolve to the new Pages site until
GoDaddy DNS is updated.

### Steps at GoDaddy

1. Log in to https://dcc.godaddy.com/domains
2. Find `pavankumar.com` → click **DNS** (or "Manage DNS")
3. Delete any existing A records for `@` and any existing CNAME for `www`
4. Add these five records:

   | Type  | Name | Value                         | TTL    |
   |-------|------|-------------------------------|--------|
   | A     | @    | `185.199.108.153`             | 1 hour |
   | A     | @    | `185.199.109.153`             | 1 hour |
   | A     | @    | `185.199.110.153`             | 1 hour |
   | A     | @    | `185.199.111.153`             | 1 hour |
   | CNAME | www  | `pavankumarkolla-prof.github.io` | 1 hour |

5. Save. DNS propagation: 5 minutes to 1 hour.

### Then tell GitHub the domain is ready

After DNS propagates:
1. Go to https://github.com/pavankumarkolla-prof/pavankumar.com/settings/pages
2. Under "Custom domain", enter `pavankumar.com` → Save
3. GitHub will verify DNS (green check appears)
4. Once verified, check "Enforce HTTPS" (may take ~24h for the Let's Encrypt cert)

### Verifying propagation (command line)

```bash
dig +short pavankumar.com A
# should return the four 185.199.108-111.153 IPs

curl -I https://pavankumar.com
# should return HTTP/2 200
```

---

## Cautions & gotchas

### 1. **The wrong local folder**
Two local directories share almost the same name. Edit the wrong one and your
changes go to the archived repo silently (git push will succeed; nothing appears
on the live site).

- ✅ `~/pavankumar.com-next/`
- ❌ `~/pavankumar.com/`

Quick check before any work session:
```bash
cd ~/pavankumar.com-next && git remote -v
# origin should show: pavankumarkolla-prof/pavankumar.com
```

### 2. **PAT in git remote URL**
The remote is currently stored as
`https://ghp_***@github.com/pavankumarkolla-prof/pavankumar.com.git`
(PAT embedded). This is functional but leaks the token if you ever share
`.git/config` or push it anywhere. The `.env` already has the token separately.

To harden, switch to SSH or use a credential helper:
```bash
git remote set-url origin git@github.com:pavankumarkolla-prof/pavankumar.com.git
# (requires SSH key added to GitHub account)
```

### 3. **Token scopes**
The active PAT (stored in `~/research-automation/.env` as `GITHUB_TOKEN`) has:
`repo, workflow, delete_repo, notifications, project, user, write:discussion, write:packages, delete:packages`

- `workflow` is required to push any changes to `.github/workflows/*.yml`.
- Without `workflow`, git silently filters those files — which is what
  originally hid `deploy.yml` from the initial push.

### 4. **GitHub Pages builds require a deploy to "seed" the site**
When a fresh repo enables Pages, the first custom-domain write can 404 until
the deploy workflow has run at least once. That's why I set `build_type=workflow`
first, then pushed, then the workflow ran. Order matters for new repos.

### 5. **Never create new repos under `pkolla04` going forward**
Every new companion repo, survey repo, or side project must go under
`pavankumarkolla-prof` to stay consistent.
`scripts/gen_repo.py` already reads `GITHUB_USERNAME` from `.env`, which is set
to `pavankumarkolla-prof` — so the pipeline will do this automatically.

### 6. **Google Analytics**
The old repo had `G-X2KSRJ82M1` per commit message `87f75fa`. Verify the new
Next.js site wires this up the same way (or replace with a new GA4 property).

### 7. **Name consistency — automated check**
All 52 public-facing "Pavan Kumar" references were updated to "Pavan Kumar Kolla"
on 2026-04-21 across:
- Paper templates (ACM, IEEE, Springer, generic)
- Pipeline scripts (`generate_paper`, `gen_survey`, `gen_repo`, `gen_post`,
  `gen_blog_post`, `prepare_arxiv`, `prepare_submission`, `setup_templates`,
  `sync_orcid`)
- `src/venue_templates.py`, `src/poc_generator.py`
- Cascadeflow companion repo (README, LICENSE, setup.py, `__init__.py`)
- CascadeFlow paper `\author{}`

If you ever notice a "Pavan Kumar" reference in a new public artifact, treat it
as a regression. Pipeline-internal refs (log messages, Claude system prompts)
were intentionally kept short.

---

## What to delete when you're ready

Non-urgent cleanup:

- `~/pavankumar.com/` — legacy local folder. Confirm no un-migrated content, then
  `rm -rf ~/pavankumar.com`.
- `pkolla04/pavankumar.com` on GitHub — archived, can be deleted via
  https://github.com/pkolla04/pavankumar.com/settings → Danger Zone.

Both are safe once the new site is confirmed working post-DNS.

---

## Rollback (if needed)

If something goes wrong post-DNS and you need the old site back fast:

1. Un-archive `pkolla04/pavankumar.com` via GitHub web UI
2. Point GoDaddy DNS back — same A records, but CNAME www → `pkolla04.github.io`
3. Re-enable Pages on the old repo with custom domain `pavankumar.com`

You have at least 30 days before GitHub hard-deletes archived repos.

---

## Reference

Migration executed by Claude Code session on 2026-04-21. Full audit trail:
- Commits in `pavankumarkolla-prof/pavankumar.com`: 5 commits starting `d9991b5`
- Commit in `pkolla04/My-Research` (pipeline): `07f1ef2` (name sweep + pipeline hardening)
- Companion repo commits: `00e5d6e`, `d6aaeb8` in `pavankumarkolla-prof/cascadeflow`
