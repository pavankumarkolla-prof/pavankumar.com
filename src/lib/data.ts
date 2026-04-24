export const siteConfig = {
  name: "Pavan Kumar Kolla",
  title: "Pavan Kumar Kolla",
  description:
    "Software Architect, AI Researcher, and Technology Leader. Designing enterprise-grade systems at the intersection of cloud platforms, applied AI, and scalable architecture.",
  url: "https://pavankumar.com",
  ogImage: "/og.png",
  githubUsername: "pavankumarkolla",
  links: {
    github: "https://github.com/pavankumarkolla",
    linkedin: "https://linkedin.com/in/pavankumarkolla",
    scholar: "#",
    email: "mailto:pavan@pavankumar.com",
  },
};

export const metrics = [
  { value: 8, suffix: "+", label: "Years Engineering", hint: "Enterprise software & architecture" },
  { value: 15, suffix: "+", label: "Systems Shipped", hint: "Production Salesforce, cloud & AI systems" },
  { value: 5, suffix: "", label: "Salesforce Orgs", hint: "Architected across Dev / QA / UAT / Prod" },
  { value: 1, suffix: "", label: "Published Papers", hint: "Peer-reviewed research" },
  { value: 40, suffix: "+", label: "Automations Built", hint: "Apex, LWC, Python pipelines" },
  { value: 100, suffix: "%", label: "Solo Ownership", hint: "Architecture → code → deploy" },
];

export const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Publications", href: "#publications" },
  { name: "Projects", href: "#projects" },
  { name: "GitHub", href: "#github" },
  { name: "Contact", href: "#contact" },
];

export const skills = [
  { name: "Salesforce (Apex, LWC, Flows)", category: "Platform" },
  { name: "Cloud Architecture (AWS, Azure)", category: "Cloud" },
  { name: "Python & AI/ML Pipelines", category: "AI" },
  { name: "REST APIs & System Integration", category: "Integration" },
  { name: "Enterprise CRM Architecture", category: "Architecture" },
  { name: "Applied AI Research", category: "Research" },
];

export const experience = [
  {
    role: "Senior Software Architect & Product Manager",
    period: "Present",
    description:
      "Designing and building enterprise-grade systems across cloud platforms, Salesforce multi-org architecture, and AI-driven automation. Leading end-to-end product and engineering for mission-critical business applications.",
    highlights: [
      "Architecting multi-org Salesforce ecosystem with cross-platform integrations",
      "Building AI-powered automation pipelines for operational efficiency",
      "Publishing peer-reviewed research on technology-enabled manufacturing transformation",
      "Full-stack product ownership from requirements through production deployment",
    ],
  },
];

export const publications = [
  {
    title:
      "Harnessing AI, Cloud Services, and Customer Operations Platforms to Reduce Cost-to-Serve and Support U.S. Manufacturing Reshoring",
    venue: "In Preparation",
    year: "2026",
    abstract:
      "This paper examines how AI, cloud services, and customer operations platforms can reduce operational cost-to-serve and support U.S. manufacturing reshoring.",
    tags: ["AI", "Cloud", "Manufacturing", "CRM"],
    doi: "",
    code: "",
    status: "in-progress" as const,
  },
];

export const projects = [
  {
    title: "Research Automation Pipeline",
    description:
      "End-to-end research pipeline automating literature review, paper generation, and submission preparation using AI.",
    tags: ["Python", "AI", "Automation"],
    github: "https://github.com/pavankumarkolla",
    demo: "",
    status: "active" as const,
  },
];
