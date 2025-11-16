export interface Stat {
  title: string;
  value: string;
  desc: string;
}

export interface Skill {
  title: string;
  desc: string;
  score: number;
  highlights: string[];
}

export interface TimelineItem {
  period: string;
  role: string;
  detail: string;
}

export interface Project {
  name: string;
  desc: string;
  metrics: string;
  tech: string[];
  cover?: string;
  link?: string;
}

export interface Article {
  title: string;
  summary: string;
  link: string;
}

export interface SocialLink {
  label: string;
  url: string;
  handle: string;
}

export interface ContactInfo {
  city: string;
  email: string;
  wechat: string;
  calendly: string;
  socials: SocialLink[];
}

export interface HeroSection {
  title: string;
  subtitle: string;
  tags: string[];
  cover?: string;
  status: {
    title: string;
    desc: string;
    location: string;
  };
}

export interface SiteContent {
  hero: HeroSection;
  stats: Stat[];
  skills: Skill[];
  timeline: TimelineItem[];
  projects: Project[];
  articles: Article[];
  contact: ContactInfo;
}
