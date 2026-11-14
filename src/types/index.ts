export interface MediaAsset {
  public_id: string;
  secure_url: string;
  alt: string;
}

export interface ServicePackageItem {
  name: string;
  price: string;
  billingType: 'one-time' | 'monthly' | 'custom';
  deliveryTime: string;
  revisions: string;
  support: string;
  features: string[];
  highlighted?: boolean;
}

export interface ServiceCategoryItem {
  _id: string;
  name: string;
  slug: string;
  filterGroup: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
}

export interface ServiceItem {
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
  features: string[];
  benefits: string[];
  technologies: string[];
  process: { step: string; title: string; description: string }[];
  packages: ServicePackageItem[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  featuredImage?: MediaAsset;
  image?: MediaAsset;
  gallery?: MediaAsset[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  featured?: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  published?: boolean;
  order: number;
}

export interface SolutionItem {
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
}

export interface IndustryItem {
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
}

export interface ProjectItem {
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
}

export interface CaseStudyItem {
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
}

export interface BlogPostItem {
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
}

export interface TeamMemberItem {
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
}

export interface TestimonialItem {
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
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface CareerItem {
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
}

export interface JobApplicationItem {
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
}

export interface ContactMessageItem {
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
}

export interface WebsiteSettingItem {
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
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  avatar?: MediaAsset;
  lastLoginAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
