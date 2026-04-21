import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pavan Kumar Kolla | Software Architect & AI Researcher",
  description:
    "Software Architect, AI Researcher, and Technology Leader. Designing enterprise-grade systems at the intersection of cloud platforms, applied AI, and scalable architecture.",
  keywords: [
    "Pavan Kumar Kolla",
    "Software Architect",
    "AI Researcher",
    "Cloud Architecture",
    "Salesforce",
    "Enterprise Architecture",
  ],
  authors: [{ name: "Pavan Kumar Kolla" }],
  openGraph: {
    title: "Pavan Kumar Kolla | Software Architect & AI Researcher",
    description:
      "Designing enterprise-grade systems at the intersection of cloud platforms, applied AI, and scalable architecture.",
    url: "https://pavankumar.com",
    siteName: "Pavan Kumar Kolla",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Kumar Kolla | Software Architect & AI Researcher",
    description:
      "Designing enterprise-grade systems at the intersection of cloud platforms, applied AI, and scalable architecture.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Pavan Kumar Kolla",
              url: "https://pavankumar.com",
              jobTitle: "Senior Software Architect",
              knowsAbout: [
                "Software Architecture",
                "Artificial Intelligence",
                "Cloud Computing",
                "Salesforce",
              ],
              sameAs: [
                "https://github.com/pavankumarkolla",
                "https://linkedin.com/in/pavankumarkolla",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full noise-bg">
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
