// Common types and interfaces

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface SkillData {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface ExperienceData {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies?: string[];
}

export interface HeroData {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  image?: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  children?: NavigationLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}