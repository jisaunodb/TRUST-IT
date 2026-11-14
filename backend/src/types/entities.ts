export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface MediaAsset {
  public_id: string;
  secure_url: string;
  alt: string;
}

export interface AdminEntity {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  avatar?: MediaAsset;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackageItem {
  name: string;
  price: string;
  billingType: string;
  features: string[];
  deliveryTime: string;
  revisions: string;
  support: string;
  ctaLabel: string;
  highlighted?: boolean;
}

export interface ServiceCategoryEntity {
  _id: string;
  name: string;
  slug: string;
  filterGroup: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceEntity {
  _id: string;
  title: string;
  slug: string;
  category: string;
  filterGroup: string;
  icon: string;
  startingPrice?: string;
  shortDescription: string;
  description: string;
  detailedDescription?: string;
  problemsSolved: string[];
  ourSolution: string;
  subServices: { title: string; slug?: string; description: string }[];
  benefits: string[];
  features: string[];
  technologies: string[];
  process: { step: string; title: string; description: string }[];
  packages: ServicePackageItem[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  featuredImage: MediaAsset;
  image?: MediaAsset;
  gallery: MediaAsset[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  featured?: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  published?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionEntity {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  modules: { title: string; description: string }[];
  benefits: string[];
  targetAudience: string[];
  technologies: string[];
  image: MediaAsset;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryEntity {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  overview: string;
  challenges: string[];
  solutions: string[];
  metrics: { label: string; value: string }[];
  technologies: string[];
  image: MediaAsset;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEntity {
  _id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  category: string;
  shortDescription: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: string[];
  metrics: { label: string; value: string }[];
  image: MediaAsset;
  gallery: MediaAsset[];
  liveUrl?: string;
  githubUrl?: string;
  completedYear: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyEntity {
  _id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary: string;
  problem: string;
  challenge: string;
  research: string;
  strategy: string;
  solution: string;
  technologies: string[];
  implementation: string;
  results: string[];
  businessImpact: string;
  clientFeedback: { quote: string; author: string; role: string };
  metrics: { label: string; value: string }[];
  image: MediaAsset;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostEntity {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  featuredImage: MediaAsset;
  readingTime: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryEntity {
  _id: string;
  name: string;
  slug: string;
  type: 'blog' | 'project';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberEntity {
  _id: string;
  name: string;
  slug: string;
  position: string;
  department: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  image: MediaAsset;
  socialLinks: { linkedin?: string; github?: string; twitter?: string };
  isLeadership: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialEntity {
  _id: string;
  clientName: string;
  role: string;
  company: string;
  industry: string;
  quote: string;
  outcomeMetric: string;
  rating: number;
  image?: MediaAsset;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQEntity {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareerEntity {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote';
  salaryRange: string;
  experience: string;
  summary: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'OPEN' | 'CLOSED';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationEntity {
  _id: string;
  careerId: string;
  careerTitle: string;
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter: string;
  resume: MediaAsset;
  status: 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageEntity {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettingEntity {
  _id: string;
  companyName: string;
  tagline: string;
  altTagline: string;
  experienceYears: number;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  businessHours: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    happyClients: number;
    professionals: number;
    clientSatisfaction: number;
  };
  clientLogos: {
    id: string;
    name: string;
    sector: string;
    logo?: MediaAsset;
  }[];
  seoDefaults: {
    siteTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  updatedAt: string;
}

export interface NewsletterSubscriberEntity {
  _id: string;
  email: string;
  createdAt: string;
}
