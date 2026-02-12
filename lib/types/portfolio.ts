export interface HeroContent {
  name: string;
  location: string;
  tagline: string;
  badgeText: string;
  badgeUrl: string;
  ctaPrimary: string;
  ctaPrimaryUrl: string;
  ctaEmail: string;
  ctaBlog: string;
  ctaBlogUrl: string;
  image: string;
  /** Optional banner (e.g. "I'm part of PH100") - leave empty to hide */
  bannerTitle?: string;
  bannerSubline?: string;
  bannerUrl?: string;
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface ExperienceItem {
  role: string;
  org: string;
  year: string;
}

export interface ExperienceContent {
  title: string;
  items: ExperienceItem[];
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface TechStackContent {
  title: string;
  viewAllUrl: string;
  categories: TechCategory[];
}

export interface BeyondCodingContent {
  title: string;
  paragraphs: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  url: string;
}

export interface ProjectsContent {
  title: string;
  viewAllUrl: string;
  items: ProjectItem[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  url: string;
}

export interface CertificationsContent {
  title: string;
  viewAllUrl: string;
  items: CertificationItem[];
}

export interface RecommendationItem {
  quote: string;
  author: string;
  role: string;
}

export interface RecommendationsContent {
  title: string;
  items: RecommendationItem[];
}

export interface AssociationItem {
  name: string;
  url: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface ContactContent {
  email: string;
  calendlyUrl: string;
  blogUrl: string;
  speakingText: string;
}

export interface GalleryContent {
  title: string;
  images: { src: string; alt: string }[];
}

export interface PortfolioContent {
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceContent;
  techStack: TechStackContent;
  beyondCoding: BeyondCodingContent;
  projects: ProjectsContent;
  certifications: CertificationsContent;
  recommendations: RecommendationsContent;
  associations: AssociationItem[];
  socialLinks: SocialLink[];
  contact: ContactContent;
  gallery: GalleryContent;
}

export const defaultPortfolioContent: PortfolioContent = {
  hero: {
    name: "Your Name",
    location: "Your City, Country",
    tagline: "Software Engineer \\ Content Creator",
    badgeText: "Featured Badge",
    badgeUrl: "#",
    ctaPrimary: "Schedule a Call",
    ctaPrimaryUrl: "https://calendly.com",
    ctaEmail: "Send Email",
    ctaBlog: "Read my blog",
    ctaBlogUrl: "#",
    image: "/jerald1.png",
    bannerTitle: "",
    bannerSubline: "",
    bannerUrl: "",
  },
  about: {
    title: "About",
    paragraphs: [
      "I'm a full-stack software engineer specializing in modern web applications. I work on projects including building web apps, mobile apps, and digital solutions.",
      "I've helped startups and businesses grow through software. I also share knowledge through content and mentorship.",
      "Lately I've been diving deeper into AI, focusing on integrating AI tools into modern applications.",
    ],
  },
  experience: {
    title: "Experience",
    items: [
      { role: "Software Engineer", org: "Company Name", year: "2024" },
      { role: "Developer", org: "Previous Co", year: "2022" },
      { role: "Education", org: "University", year: "2019" },
    ],
  },
  techStack: {
    title: "Tech Stack",
    viewAllUrl: "/stack",
    categories: [
      { name: "Frontend", items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
      { name: "Backend", items: ["Node.js", "Python", "PostgreSQL"] },
      { name: "DevOps & Cloud", items: ["AWS", "Docker", "GitHub Actions"] },
    ],
  },
  beyondCoding: {
    title: "Beyond Coding",
    paragraphs: [
      "When not writing code, I focus on learning emerging technologies and sharing knowledge through content.",
    ],
  },
  projects: {
    title: "Recent Projects",
    viewAllUrl: "#",
    items: [
      { title: "Project One", description: "Short description", url: "#" },
      { title: "Project Two", description: "Short description", url: "#" },
    ],
  },
  certifications: {
    title: "Recent Certifications",
    viewAllUrl: "#",
    items: [
      { title: "Certification Name", issuer: "Issuer", url: "#" },
    ],
  },
  recommendations: {
    title: "Recommendations",
    items: [
      { quote: "A great professional to work with.", author: "Name", role: "Title, Company" },
    ],
  },
  associations: [
    { name: "Association Name", url: "https://example.com" },
  ],
  socialLinks: [
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "GitHub", url: "https://github.com" },
  ],
  contact: {
    email: "your@email.com",
    calendlyUrl: "https://calendly.com",
    blogUrl: "#",
    speakingText: "Available for speaking at events. Get in touch.",
  },
  gallery: {
    title: "Gallery",
    images: [
      { src: "/jerald1.png", alt: "Photo 1" },
      { src: "/jerald2.png", alt: "Photo 2" },
    ],
  },
};
