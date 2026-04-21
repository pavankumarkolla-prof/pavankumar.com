"use client";

import { siteConfig } from "@/lib/data";
import { GitHubIcon, LinkedInIcon, GoogleScholarIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative border-t border-border py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} {siteConfig.name}
          </p>

          <div className="flex items-center gap-4">
            {[
              {
                icon: GitHubIcon,
                href: siteConfig.links.github,
                label: "GitHub",
              },
              {
                icon: LinkedInIcon,
                href: siteConfig.links.linkedin,
                label: "LinkedIn",
              },
              {
                icon: GoogleScholarIcon,
                href: siteConfig.links.scholar,
                label: "Google Scholar",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
