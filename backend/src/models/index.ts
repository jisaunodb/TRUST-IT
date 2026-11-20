import mongoose, { Schema } from 'mongoose';

const MediaAssetSchema = new Schema(
  {
    public_id: { type: String, required: true, default: '' },
    secure_url: { type: String, required: true, default: '' },
    alt: { type: String, required: true, default: '' },
  },
  { _id: false }
);

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN'], default: 'ADMIN', required: true },
    avatar: { type: MediaAssetSchema, required: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

const ServiceCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    filterGroup: { type: String, required: true, index: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Layers' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const ServicePackageSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    billingType: { type: String, default: 'One-Time' },
    features: [{ type: String }],
    deliveryTime: { type: String, default: '4–6 Weeks' },
    revisions: { type: String, default: 'Unlimited in Sprint' },
    support: { type: String, default: '60 Days Warranty' },
    ctaLabel: { type: String, default: 'Get Started' },
    highlighted: { type: Boolean, default: false },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    filterGroup: { type: String, required: true, index: true, default: 'Development' },
    icon: { type: String, required: true, default: 'Code2' },
    startingPrice: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    detailedDescription: { type: String },
    problemsSolved: [{ type: String }],
    ourSolution: { type: String, default: '' },
    subServices: [
      {
        title: String,
        slug: String,
        description: String,
      },
    ],
    benefits: [{ type: String }],
    features: [{ type: String }],
    technologies: [{ type: String }],
    process: [
      {
        step: String,
        title: String,
        description: String,
      },
    ],
    packages: [ServicePackageSchema],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    relatedServices: [{ type: String }],
    featuredImage: { type: MediaAssetSchema, required: true },
    image: { type: MediaAssetSchema },
    gallery: [MediaAssetSchema],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    seoTitle: String,
    seoDescription: String,
    isFeatured: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'PUBLISHED', index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SolutionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    icon: { type: String, required: true, default: 'Layers' },
    tagline: { type: String, required: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    modules: [{ title: String, description: String }],
    benefits: [{ type: String }],
    targetAudience: [{ type: String }],
    technologies: [{ type: String }],
    image: { type: MediaAssetSchema, required: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const IndustrySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    icon: { type: String, required: true, default: 'Building2' },
    shortDescription: { type: String, required: true },
    overview: { type: String, required: true },
    challenges: [{ type: String }],
    solutions: [{ type: String }],
    metrics: [{ label: String, value: String }],
    technologies: [{ type: String }],
    image: { type: MediaAssetSchema, required: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    client: { type: String, required: true },
    industry: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    technologies: [{ type: String, index: true }],
    results: [{ type: String }],
    metrics: [{ label: String, value: String }],
    image: { type: MediaAssetSchema, required: true },
    gallery: [MediaAssetSchema],
    liveUrl: String,
    githubUrl: String,
    completedYear: { type: String, default: '2026' },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    client: { type: String, required: true },
    industry: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    problem: { type: String, required: true },
    challenge: { type: String, required: true },
    research: { type: String, required: true },
    strategy: { type: String, required: true },
    solution: { type: String, required: true },
    technologies: [{ type: String }],
    implementation: { type: String, required: true },
    results: [{ type: String }],
    businessImpact: { type: String, required: true },
    clientFeedback: {
      quote: String,
      author: String,
      role: String,
    },
    metrics: [{ label: String, value: String }],
    image: { type: MediaAssetSchema, required: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, default: 'Engineering Team' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    featuredImage: { type: MediaAssetSchema, required: true },
    readingTime: { type: String, default: '5 min read' },
    seoTitle: String,
    seoDescription: String,
    keywords: [{ type: String }],
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'PUBLISHED', index: true },
    featured: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    type: { type: String, enum: ['blog', 'project'], required: true, index: true },
    description: String,
  },
  { timestamps: true }
);

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    bio: { type: String, required: true },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    image: { type: MediaAssetSchema, required: true },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
    },
    isLeadership: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    industry: { type: String, required: true },
    quote: { type: String, required: true },
    outcomeMetric: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: MediaAssetSchema, required: false },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const CareerSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    department: { type: String, required: true, index: true },
    location: { type: String, required: true },
    employmentType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Remote'], default: 'Full-Time' },
    salaryRange: { type: String, required: true },
    experience: { type: String, required: true },
    summary: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN', index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const JobApplicationSchema = new Schema(
  {
    careerId: { type: String, required: true, index: true },
    careerTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    linkedin: String,
    portfolio: String,
    coverLetter: { type: String, required: true },
    resume: { type: MediaAssetSchema, required: true },
    status: { type: String, enum: ['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED'], default: 'NEW', index: true },
  },
  { timestamps: true }
);

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    company: String,
    service: { type: String, required: true },
    budget: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'], default: 'NEW', index: true },
    notes: String,
  },
  { timestamps: true }
);

const WebsiteSettingSchema = new Schema(
  {
    companyName: { type: String, required: true },
    tagline: { type: String, required: true },
    altTagline: { type: String, required: true },
    experienceYears: { type: Number, default: 6 },
    heroHeadline: { type: String, required: true },
    heroSubheadline: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    address: { type: String, required: true },
    businessHours: { type: String, required: true },
    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
      youtube: String,
      github: String,
    },
    stats: {
      yearsExperience: Number,
      projectsCompleted: Number,
      happyClients: Number,
      professionals: Number,
      clientSatisfaction: Number,
    },
    clientLogos: [
      {
        id: String,
        name: String,
        sector: String,
        logo: MediaAssetSchema,
      },
    ],
    seoDefaults: {
      siteTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const ServiceCategoryModel =
  mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);
export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const SolutionModel = mongoose.models.Solution || mongoose.model('Solution', SolutionSchema);
export const IndustryModel = mongoose.models.Industry || mongoose.model('Industry', IndustrySchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const CaseStudyModel = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);
export const BlogPostModel = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const TeamMemberModel = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export const FAQModel = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
export const CareerModel = mongoose.models.Career || mongoose.model('Career', CareerSchema);
export const JobApplicationModel =
  mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
export const ContactMessageModel =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export const WebsiteSettingModel =
  mongoose.models.WebsiteSetting || mongoose.model('WebsiteSetting', WebsiteSettingSchema);
export const NewsletterSubscriberModel =
  mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
