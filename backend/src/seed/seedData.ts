import bcrypt from 'bcryptjs';
import { env } from '../config/env.ts';
import { repos } from '../services/repository.ts';
import { IMAGES, seedIndustries, seedServiceCategories, seedServices, seedSolutions } from './catalogData.ts';

const seedProjects = [
  {
    title: 'MeghnaPay Enterprise Treasury & Settlement Portal',
    slug: 'meghnapay-enterprise-treasury-portal',
    client: 'Meghna Financial Services Ltd.',
    industry: 'Finance',
    category: 'FinTech & Enterprise Software',
    shortDescription: 'Real-time corporate treasury, bulk disbursement, and automated reconciliation platform processing BDT 450Cr+ monthly.',
    description: 'Trust IT engineered a high-security treasury portal enabling corporate finance teams to authorize multi-tier payroll, vendor settlements, and automated bank reconciliation.',
    challenge: 'Legacy CSV uploads and manual spreadsheet checks took 3 business days per settlement cycle and created audit bottlenecks.',
    solution: 'Built a maker-checker web platform with real-time ledger verification, role-based cryptographic signing, and automated exception alerts.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    results: ['Settlement cycle reduced from 72 hours to 12 minutes', '100% automated ledger reconciliation accuracy', 'Zero security incidents across 24 months'],
    metrics: [
      { label: 'Monthly Volume', value: '৳450Cr+' },
      { label: 'Settlement Speed', value: '12 min' },
      { label: 'Uptime SLA', value: '99.98%' },
    ],
    image: { public_id: 'seed/projects/fintech', secure_url: IMAGES.fintech, alt: 'MeghnaPay Enterprise Treasury Dashboard' },
    gallery: [{ public_id: 'seed/projects/fintech-1', secure_url: IMAGES.fintech, alt: 'Treasury Overview' }],
    liveUrl: 'https://trustit.com.bd/projects/meghnapay-enterprise-treasury-portal',
    completedYear: '2025',
    featured: true,
    published: true,
  },
  {
    title: 'Bengal Thread Omnichannel Retail & Warehouse ERP',
    slug: 'bengal-thread-omnichannel-erp',
    client: 'Bengal Thread Apparel Group',
    industry: 'Retail',
    category: 'E-commerce & ERP',
    shortDescription: 'Unified online storefront, 28 showroom POS terminals, and central warehouse inventory ledger synced in real time.',
    description: 'We replaced 4 disconnected systems with a single omnichannel commerce and ERP core serving online shoppers and 28 physical retail outlets across Dhaka, Chattogram, and Sylhet.',
    challenge: 'Overselling online due to delayed outlet stock sync and manual courier booking across 1,500+ daily orders.',
    solution: 'Engineered real-time inventory reservation, offline-capable showroom POS, and direct Steadfast & Pathao courier API dispatch.',
    technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Redis', 'Cloudinary'],
    results: ['+42% online conversion rate within 90 days', '99.4% inventory accuracy across 28 branches', '70% reduction in dispatch errors'],
    metrics: [
      { label: 'Conversion Lift', value: '+42%' },
      { label: 'Synced Outlets', value: '28' },
      { label: 'Daily Orders', value: '1,800+' },
    ],
    image: { public_id: 'seed/projects/erp', secure_url: IMAGES.erp, alt: 'Bengal Thread Omnichannel Retail ERP' },
    gallery: [{ public_id: 'seed/projects/erp-1', secure_url: IMAGES.erp, alt: 'Inventory Console' }],
    liveUrl: 'https://trustit.com.bd/projects/bengal-thread-omnichannel-erp',
    completedYear: '2026',
    featured: true,
    published: true,
  },
  {
    title: 'CareLine Diagnostics & Cloud Patient Portal',
    slug: 'careline-diagnostics-cloud-portal',
    client: 'CareLine Specialized Hospital',
    industry: 'Healthcare',
    category: 'Healthcare & Cloud',
    shortDescription: 'End-to-end hospital EMR, diagnostic lab barcode automation, and instant QR-verified online patient report delivery.',
    description: 'A HIPAA-inspired clinical portal connecting 65 physicians, diagnostic analyzers, pharmacy inventory, and thousands of daily outpatients.',
    challenge: 'Patients waited up to 4 hours for printed diagnostic reports, and manual ward billing caused revenue leakage.',
    solution: 'Deployed automated lab report PDF generation with SMS portal links, token queue displays, and unified OPD/IPD billing.',
    technologies: ['React', 'TypeScript', 'Express.js', 'PostgreSQL', 'AWS', 'Docker'],
    results: ['Patient check-in wait time dropped by 60%', '85,000+ monthly digital reports delivered', 'Zero unbilled lab tests'],
    metrics: [
      { label: 'Wait Time Drop', value: '-60%' },
      { label: 'Monthly Reports', value: '85K+' },
      { label: 'Active Doctors', value: '65' },
    ],
    image: { public_id: 'seed/projects/healthcare', secure_url: IMAGES.healthcare, alt: 'CareLine Hospital Cloud Portal' },
    gallery: [{ public_id: 'seed/projects/healthcare-1', secure_url: IMAGES.healthcare, alt: 'Patient Portal' }],
    liveUrl: 'https://trustit.com.bd/projects/careline-diagnostics-cloud-portal',
    completedYear: '2025',
    featured: true,
    published: true,
  },
  {
    title: 'Apex Logistics Nationwide Courier & Fleet Engine',
    slug: 'apex-logistics-courier-fleet-engine',
    client: 'Apex Express Bangladesh',
    industry: 'Logistics',
    category: 'Mobile & Logistics',
    shortDescription: 'Hub-and-spoke parcel tracking, rider mobile app, and automated 24-hour merchant COD payout system.',
    description: 'High-throughput logistics backbone handling nationwide parcel scanning, rider proof-of-delivery capture, and merchant settlement dashboards.',
    challenge: 'Delayed COD reconciliation eroded merchant trust, and manual hub sorting caused route misdeliveries.',
    solution: 'Built a React Native rider app with barcode scanning and an automated COD ledger settling 4,000+ merchants daily.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Redis', 'Google Cloud'],
    results: ['97.4% on-time delivery SLA across 64 districts', 'Merchant COD payouts automated in 24 hours', '3x faster hub sorting'],
    metrics: [
      { label: 'District Coverage', value: '64' },
      { label: 'SLA Rate', value: '97.4%' },
      { label: 'Daily Parcels', value: '22,000+' },
    ],
    image: { public_id: 'seed/projects/logistics', secure_url: IMAGES.cloud, alt: 'Apex Logistics Infrastructure' },
    gallery: [],
    completedYear: '2025',
    featured: false,
    published: true,
  },
  {
    title: 'Dhaka International Academy Digital Campus',
    slug: 'dhaka-international-academy-campus',
    client: 'Dhaka International Academy',
    industry: 'Education',
    category: 'EdTech & SaaS',
    shortDescription: 'Integrated student lifecycle, automated tuition billing via bKash/SSLCommerz, and parent mobile portal.',
    description: 'Modernized campus operations for 4,200+ students and 280 faculty members with paperless grading, attendance alerts, and digital fee receipts.',
    challenge: 'Long queues at bank booths for monthly tuition and 3-week delays in term transcript publication.',
    solution: 'Delivered an online payment gateway integration and instant automated gradebook compilation.',
    technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Node.js'],
    results: ['92% tuition paid digitally within 10 days', 'Term results published in 24 hours', '100% parent adoption'],
    metrics: [
      { label: 'Digital Payments', value: '92%' },
      { label: 'Students Served', value: '4,200+' },
      { label: 'Admin Time Saved', value: '75%' },
    ],
    image: { public_id: 'seed/projects/edtech', secure_url: IMAGES.office, alt: 'Digital Campus Platform' },
    gallery: [],
    completedYear: '2024',
    featured: false,
    published: true,
  },
  {
    title: 'Padma Agro Supply Chain & Procurement Suite',
    slug: 'padma-agro-supply-chain-suite',
    client: 'Padma Agro Industries Ltd.',
    industry: 'Manufacturing',
    category: 'Enterprise ERP',
    shortDescription: 'Raw material procurement, factory batch costing, and distributor portal for a leading FMCG manufacturer.',
    description: 'Centralized raw material sourcing, factory production batch tracking, and distributor order management across 14 depots.',
    challenge: 'Volatile raw material pricing made manual unit costing inaccurate and delayed distributor credit checks.',
    solution: 'Built live weighted-average batch costing and automated credit limit enforcement at order approval.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    results: ['99.2% batch costing accuracy', '18% reduction in working capital tied in excess stock', 'Faster depot fulfillment'],
    metrics: [
      { label: 'Cost Accuracy', value: '99.2%' },
      { label: 'Depots Connected', value: '14' },
      { label: 'Stock Reduction', value: '-18%' },
    ],
    image: { public_id: 'seed/projects/agro', secure_url: IMAGES.hero, alt: 'Padma Agro ERP Command' },
    gallery: [],
    completedYear: '2024',
    featured: false,
    published: true,
  },
];

const seedCaseStudies = [
  {
    title: 'Scaling Omnichannel Retail Across 28 Outlets Without Overselling',
    slug: 'scaling-omnichannel-retail-28-outlets',
    client: 'Bengal Thread Apparel Group',
    industry: 'Retail & E-commerce',
    summary: 'How Trust IT unified 28 physical retail stores, a high-traffic web storefront, and central warehouse fulfillment into one real-time ERP architecture.',
    problem: 'Bengal Thread operated separate POS databases per store and an isolated WooCommerce site, causing 14% order cancellations from phantom stock.',
    challenge: 'Showrooms frequently suffered internet instability during peak Eid campaigns, making naive cloud-only POS architectures unviable.',
    research: 'Our architects shadowed floor cashiers and warehouse packers in Dhaka and Gazipur for two weeks to map peak checkout latency and return workflows.',
    strategy: 'Adopt a hybrid event-driven inventory core backed by Redis stock locks and an IndexedDB offline-first POS shell that syncs automatically on reconnect.',
    solution: 'Engineered a custom Next.js storefront, offline-resilient React POS, and Express/MongoDB central inventory service with automated Steadfast & Pathao courier dispatch.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Redis', 'Cloudinary'],
    implementation: 'Rolled out in 3 phased waves across 14 weeks: pilot at 3 flagship Dhaka outlets, warehouse barcode migration, then nationwide 28-branch cutover before peak season.',
    results: ['+42% online conversion rate in Q1 post-launch', 'Order cancellation from stockout dropped from 14% to 0.3%', '1,800+ daily orders processed with 30% fewer warehouse hours'],
    businessImpact: 'Unlocked BDT 18 Crore in incremental annual digital revenue while cutting manual inventory reconciliation costs.',
    clientFeedback: {
      quote: 'Trust IT understood Bangladeshi retail realities—especially Eid traffic spikes and intermittent branch connectivity. Their system never blinked during our biggest season.',
      author: 'Mahmudul Hasan',
      role: 'Director of Operations, Bengal Thread Group',
    },
    metrics: [
      { label: 'Conversion Lift', value: '+42%' },
      { label: 'Stockout Cancels', value: '0.3%' },
      { label: 'ROI Payback', value: '5 Months' },
    ],
    image: { public_id: 'seed/cs/retail', secure_url: IMAGES.erp, alt: 'Omnichannel Retail Case Study' },
    featured: true,
    published: true,
  },
  {
    title: 'Zero-Trust Treasury Modernization for High-Volume Corporate Payouts',
    slug: 'zero-trust-treasury-modernization',
    client: 'Meghna Financial Services Ltd.',
    industry: 'Finance',
    summary: 'Replacing manual multi-bank spreadsheet disbursements with an auditable, cryptographically signed corporate treasury engine.',
    problem: 'Corporate clients waited up to 3 days for bulk vendor and payroll settlements due to manual CSV validation and email approvals.',
    challenge: 'Meeting strict central-bank audit trail requirements while handling 120,000+ monthly transaction rows without UI lag.',
    research: 'Conducted threat modeling and compliance workshops with internal risk officers and corporate treasury controllers.',
    strategy: 'Implement strict role segregation (maker, checker, authorizer), immutable audit logs, and asynchronous worker queues for bank gateway clearing.',
    solution: 'Delivered an enterprise Next.js and PostgreSQL/Node.js treasury platform with automated mismatch detection and instant reconciliation exports.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    implementation: 'Executed parallel dry-run validation alongside legacy workflows for 30 days to verify 100% ledger parity before full cutover.',
    results: ['Settlement cycle cut from 72 hours to 12 minutes', '100% audit trail readiness for regulatory reviews', '45% increase in enterprise corporate onboarding'],
    businessImpact: 'Positioned Meghna Financial as the fastest corporate disbursement partner in their segment.',
    clientFeedback: {
      quote: 'Their engineering discipline and security rigor gave our risk committee complete confidence from architecture review to go-live.',
      author: 'Farhana Yasmin',
      role: 'Head of Digital Banking, Meghna Financial',
    },
    metrics: [
      { label: 'Cycle Reduction', value: '99.7%' },
      { label: 'Monthly Volume', value: '৳450Cr+' },
      { label: 'Audit Pass', value: '100%' },
    ],
    image: { public_id: 'seed/cs/fintech', secure_url: IMAGES.fintech, alt: 'Fintech Treasury Case Study' },
    featured: true,
    published: true,
  },
  {
    title: 'Cloud Migration & Patient Portal Overhaul for a 400-Bed Hospital',
    slug: 'cloud-migration-patient-portal-hospital',
    client: 'CareLine Specialized Hospital',
    industry: 'Healthcare',
    summary: 'Eliminating diagnostic bottlenecks and unifying OPD, IPD, lab, and pharmacy billing on resilient cloud infrastructure.',
    problem: 'On-premise servers crashed during morning OPD rushes, and patients queued twice to collect printed lab reports.',
    challenge: 'Migrating 8 years of historical patient records while operating a 24/7 emergency and inpatient facility.',
    research: 'Audited peak morning reception throughput and interviewed 18 nurses, lab technicians, and doctors.',
    strategy: 'Build an HL7/ASTM lab analyzer bridge paired with an auto-scaling AWS cloud deployment and instant SMS report delivery.',
    solution: 'Launched CareLine Cloud EMR with QR-verified diagnostic PDFs, doctor scheduling, and automated pharmacy billing.',
    technologies: ['React', 'TypeScript', 'Express.js', 'PostgreSQL', 'Docker', 'AWS'],
    implementation: 'Zero-downtime night migration with automated checksum verification across 1.4 million patient records.',
    results: ['60% reduction in patient reception wait times', '85,000+ reports accessed online monthly', '99.98% uptime over 18 months'],
    businessImpact: 'Improved patient satisfaction scores and recovered significant unbilled diagnostic revenue.',
    clientFeedback: {
      quote: 'Moving off fragile local servers onto Trust IT’s cloud platform transformed both our clinical speed and patient experience.',
      author: 'Dr. Kamrul Ahsan',
      role: 'Chief Operating Officer, CareLine Hospital',
    },
    metrics: [
      { label: 'Wait Reduction', value: '-60%' },
      { label: 'Records Migrated', value: '1.4M' },
      { label: 'Cloud Uptime', value: '99.98%' },
    ],
    image: { public_id: 'seed/cs/healthcare', secure_url: IMAGES.healthcare, alt: 'Healthcare Cloud Case Study' },
    featured: true,
    published: true,
  },
];

const seedCategories = [
  { name: 'Web Development', slug: 'web-development', type: 'blog', description: 'Modern web engineering and Next.js architecture' },
  { name: 'Cloud', slug: 'cloud', type: 'blog', description: 'AWS, GCP, DevOps, and scalable infrastructure' },
  { name: 'Cybersecurity', slug: 'cybersecurity', type: 'blog', description: 'Application security and enterprise compliance' },
  { name: 'Software', slug: 'software', type: 'blog', description: 'Enterprise software patterns and ERP modernization' },
  { name: 'AI', slug: 'ai', type: 'blog', description: 'Practical automation and applied intelligence for business' },
  { name: 'Digital Marketing', slug: 'digital-marketing', type: 'blog', description: 'Growth, analytics, and conversion strategy' },
  { name: 'SEO', slug: 'seo', type: 'blog', description: 'Technical SEO and Bangladeshi search visibility' },
];

const seedBlogPosts = [
  {
    title: 'Architecting High-Availability Web Platforms for Peak Traffic in Bangladesh',
    slug: 'architecting-high-availability-web-platforms-bangladesh',
    excerpt: 'How Bangladeshi e-commerce and fintech teams prevent downtime during Eid campaigns, flash sales, and billing cycles using edge caching and queue-backed APIs.',
    content: `## Why Peak Traffic Breaks Traditional Monoliths\n\nEvery major campaign season in Dhaka exposes the same architectural flaw: database connection pools saturate while uncached product or dashboard queries pile up.\n\n### 1. Separate Read Paths from Transactional Writes\nUse Redis read-through caching and CDN stale-while-revalidate headers for catalog and editorial pages so 90% of requests never hit your primary database.\n\n### 2. Design Idempotent Payment & Courier Webhooks\nLocal MFS gateways and courier callbacks can retry unpredictably under load. Always enforce idempotency keys and process heavy side effects (PDF invoices, SMS alerts) via background queues.\n\n### 3. Measure Core Web Vitals on Real 4G Connections\nMost Bangladeshi users browse on mid-range Android devices over variable 4G networks. Keep JavaScript bundles lean, optimize images via Cloudinary f_auto/q_auto, and eliminate layout shift.`,
    author: 'Tariqul Islam',
    authorRole: 'Managing Director & Principal Architect',
    category: 'Web Development',
    tags: ['Next.js', 'Performance', 'Bangladesh Tech', 'Scalability'],
    featuredImage: { public_id: 'seed/blog/web-perf', secure_url: IMAGES.hero, alt: 'Trust IT Engineering Team' },
    readingTime: '6 min read',
    seoTitle: 'High-Availability Web Architecture in Bangladesh | Trust IT',
    seoDescription: 'Engineering blueprint for high-traffic Bangladeshi web and e-commerce applications.',
    keywords: ['Web Development Company Bangladesh', 'High Availability Architecture', 'Next.js Bangladesh'],
    status: 'PUBLISHED',
    featured: true,
    publishedAt: '2026-10-18T09:00:00.000Z',
  },
  {
    title: 'Zero-Trust Security Checklist for Enterprise Web Applications',
    slug: 'zero-trust-security-checklist-enterprise-web-apps',
    excerpt: 'Practical security controls every CTO in Bangladesh should enforce before launching customer portals, fintech apps, or internal ERPs.',
    content: `## Security Is Architecture, Not a Final Checkbox\n\nOver 12 years of auditing legacy enterprise software, we consistently see the same preventable risks: exposed admin routes, weak session expiration, and unsanitized query operators.\n\n### Essential Controls\n- Enforce HTTP-only, SameSite cookies for admin authentication with strict role middleware.\n- Validate every request body against explicit schemas (Zod) before database persistence.\n- Apply per-route rate limiting on authentication, lead forms, and file uploads.\n- Maintain automated encrypted backups tested quarterly for restore integrity.`,
    author: 'Tanvir Ahmed',
    authorRole: 'Head of Cloud & Cybersecurity',
    category: 'Cybersecurity',
    tags: ['Zero Trust', 'OWASP', 'API Security', 'Compliance'],
    featuredImage: { public_id: 'seed/blog/security', secure_url: IMAGES.cloud, alt: 'Enterprise Data Center Security' },
    readingTime: '5 min read',
    seoTitle: 'Zero-Trust Web Security Checklist | Trust IT Bangladesh',
    seoDescription: 'Actionable cybersecurity checklist for enterprise software and fintech platforms.',
    keywords: ['Cybersecurity Bangladesh', 'Enterprise Software Security', 'OWASP Checklist'],
    status: 'PUBLISHED',
    featured: true,
    publishedAt: '2026-10-04T09:00:00.000Z',
  },
  {
    title: 'Build vs. Buy: When Bangladeshi Enterprises Should Invest in Custom ERP',
    slug: 'build-vs-buy-custom-erp-bangladesh',
    excerpt: 'Comparing off-the-shelf SaaS licenses against custom-built ERP systems for multi-branch distribution, RMG, and corporate groups.',
    content: `## The Hidden Cost of Rigid Off-the-Shelf Software\n\nOff-the-shelf tools work well when your workflows match standard global templates. However, growing Bangladeshi groups face local VAT Mushak reporting, multi-tier credit approvals, and hybrid offline retail realities.\n\n### When Custom Software Wins\n1. Per-user SaaS licensing exceeds custom build amortization over 24 months.\n2. Your competitive advantage relies on specialized pricing, supply chain, or factory costing rules.\n3. You require deep integration with local banks, MFS gateways, and legacy biometric hardware.`,
    author: 'Nusrat Jahan',
    authorRole: 'Chief Technology Officer',
    category: 'Software',
    tags: ['ERP', 'Custom Software', 'Digital Transformation'],
    featuredImage: { public_id: 'seed/blog/erp', secure_url: IMAGES.office, alt: 'Enterprise Architecture Review' },
    readingTime: '7 min read',
    seoTitle: 'Custom ERP vs Off-the-Shelf Software in Bangladesh | Trust IT',
    seoDescription: 'How to decide between off-the-shelf SaaS and custom ERP development.',
    keywords: ['Software Company in Bangladesh', 'Custom ERP Bangladesh', 'Enterprise Solutions'],
    status: 'PUBLISHED',
    featured: true,
    publishedAt: '2026-09-21T09:00:00.000Z',
  },
  {
    title: 'Controlling AWS & Cloud Costs Without Sacrificing Reliability',
    slug: 'controlling-aws-cloud-costs-reliability',
    excerpt: 'Proven FinOps practices that helped our enterprise clients cut monthly cloud bills by 30–40% while improving uptime.',
    content: `## Stop Over-Provisioning Compute for Average Traffic\n\nMany organizations migrate on-premise servers to the cloud by lifting oversized VMs 1:1—paying 24/7 for peak capacity used only 4 hours a day.\n\n### Practical Cloud Optimizations\n- Move static media and heavy image transformations to Cloudinary auto-optimization.\n- Use managed auto-scaling groups and scheduled staging shutdowns outside business hours.\n- Right-size database read replicas and index slow aggregation queries.`,
    author: 'Tanvir Ahmed',
    authorRole: 'Head of Cloud & Cybersecurity',
    category: 'Cloud',
    tags: ['AWS', 'FinOps', 'Cloud Migration', 'DevOps'],
    featuredImage: { public_id: 'seed/blog/cloud-cost', secure_url: IMAGES.cloud, alt: 'Cloud Server Infrastructure' },
    readingTime: '5 min read',
    seoTitle: 'AWS Cloud Cost Optimization Guide | Trust IT',
    seoDescription: 'Reduce enterprise cloud infrastructure spend by 35% with FinOps best practices.',
    keywords: ['Cloud Solutions Bangladesh', 'AWS Optimization', 'DevOps Bangladesh'],
    status: 'PUBLISHED',
    featured: false,
    publishedAt: '2026-09-08T09:00:00.000Z',
  },
  {
    title: 'Technical SEO for Service Businesses in Dhaka: Beyond Keywords',
    slug: 'technical-seo-service-businesses-dhaka',
    excerpt: 'Why Schema.org structured data, clean URL hierarchy, and page speed determine who wins high-intent B2B search in Bangladesh.',
    content: `## Modern Search Evaluates Authority and Experience\n\nKeyword stuffing no longer works. Search engines reward clear topical architecture, verified Organization and Service JSON-LD markup, and fast mobile rendering.\n\n### Four Pillars We Implement on Every Client Build\n1. Semantic headings and single-intent service landing pages.\n2. Validated JSON-LD structured data (Organization, Service, FAQPage, BreadcrumbList).\n3. Dynamic XML sitemaps kept in sync with CMS publishing.\n4. Fast server responses and descriptive image alt attributes.`,
    author: 'Sadia Rahman',
    authorRole: 'Head of Digital Growth & SEO',
    category: 'SEO',
    tags: ['Technical SEO', 'Schema.org', 'B2B Growth'],
    featuredImage: { public_id: 'seed/blog/seo', secure_url: IMAGES.fintech, alt: 'SEO Analytics Console' },
    readingTime: '4 min read',
    seoTitle: 'Technical SEO Guide for Bangladesh Businesses | Trust IT',
    seoDescription: 'Win organic B2B search in Bangladesh with Schema.org and Core Web Vitals.',
    keywords: ['SEO Services Bangladesh', 'Technical SEO Dhaka', 'Digital Solutions Bangladesh'],
    status: 'PUBLISHED',
    featured: false,
    publishedAt: '2026-08-25T09:00:00.000Z',
  },
  {
    title: 'Practical AI Workflow Automation for Operations Teams',
    slug: 'practical-ai-workflow-automation-operations',
    excerpt: 'Moving past hype to deploy reliable document extraction, ticket routing, and anomaly alerts in everyday enterprise operations.',
    content: `## Focus on Measurable Time Saved, Not Demo Novelty\n\nThe highest-ROI automation deployments combine deterministic business validation with targeted language and document processing—always keeping human approval gates for financial actions.\n\n### High-Impact Enterprise Use Cases\n- Automated invoice and purchase order data extraction into ERP drafts.\n- Intelligent customer support triage and SLA routing.\n- Automated daily executive anomaly summaries.`,
    author: 'Nusrat Jahan',
    authorRole: 'Chief Technology Officer',
    category: 'AI',
    tags: ['Automation', 'Enterprise AI', 'Workflows'],
    featuredImage: { public_id: 'seed/blog/ai', secure_url: IMAGES.office, alt: 'Operations Automation Workshop' },
    readingTime: '5 min read',
    seoTitle: 'Practical AI Automation for Enterprises | Trust IT',
    seoDescription: 'Deploy reliable workflow automation with measurable ROI.',
    keywords: ['Business Automation Bangladesh', 'Enterprise AI', 'Trust IT'],
    status: 'PUBLISHED',
    featured: false,
    publishedAt: '2026-08-12T09:00:00.000Z',
  },
];

const seedTeam = [
  {
    name: 'Tariqul Islam',
    slug: 'tariqul-islam',
    position: 'Founder & Managing Director',
    department: 'Executive Leadership',
    bio: 'Over 15 years architecting enterprise software and leading digital transformation programs across banking, retail, and healthcare in Bangladesh and Southeast Asia.',
    skills: ['Enterprise Architecture', 'Digital Strategy', 'Product Governance', 'FinTech'],
    experienceYears: 15,
    image: { public_id: 'seed/team/tariqul', secure_url: IMAGES.md, alt: 'Tariqul Islam, Founder & Managing Director' },
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    isLeadership: true,
    published: true,
    order: 1,
  },
  {
    name: 'Nusrat Jahan',
    slug: 'nusrat-jahan',
    position: 'Chief Technology Officer',
    department: 'Engineering',
    bio: 'Leads 50+ engineers across web, mobile, and ERP practices, enforcing high code quality, automated testing, and scalable cloud-native standards.',
    skills: ['Distributed Systems', 'TypeScript', 'Next.js', 'PostgreSQL', 'System Design'],
    experienceYears: 13,
    image: { public_id: 'seed/team/nusrat', secure_url: IMAGES.cto, alt: 'Nusrat Jahan, Chief Technology Officer' },
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    isLeadership: true,
    published: true,
    order: 2,
  },
  {
    name: 'Tanvir Ahmed',
    slug: 'tanvir-ahmed',
    position: 'Head of Cloud & Cybersecurity',
    department: 'Cloud & Security',
    bio: 'AWS Certified Solutions Architect overseeing zero-trust security audits, Kubernetes operations, and 99.95% SLA infrastructure.',
    skills: ['AWS', 'Google Cloud', 'Cybersecurity', 'Docker', 'Terraform'],
    experienceYears: 11,
    image: { public_id: 'seed/team/tanvir', secure_url: IMAGES.lead, alt: 'Tanvir Ahmed, Head of Cloud & Cybersecurity' },
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    isLeadership: true,
    published: true,
    order: 3,
  },
  {
    name: 'Sadia Rahman',
    slug: 'sadia-rahman',
    position: 'Principal Product Designer',
    department: 'UI/UX Design',
    bio: 'Specializes in high-clarity enterprise design systems, B2B workflow simplification, and accessible WCAG-compliant interfaces.',
    skills: ['Design Systems', 'UX Research', 'Figma', 'Accessibility', 'Conversion UX'],
    experienceYears: 9,
    image: { public_id: 'seed/team/sadia', secure_url: IMAGES.cto, alt: 'Sadia Rahman, Principal Product Designer' },
    socialLinks: { linkedin: 'https://linkedin.com' },
    isLeadership: false,
    published: true,
    order: 4,
  },
  {
    name: 'Rafiqul Karim',
    slug: 'rafiqul-karim',
    position: 'Lead Full-Stack Engineer',
    department: 'Engineering',
    bio: 'Architects high-throughput Node.js, MongoDB, and React platforms for omnichannel e-commerce and logistics clients.',
    skills: ['Node.js', 'React', 'MongoDB', 'Redis', 'REST APIs'],
    experienceYears: 8,
    image: { public_id: 'seed/team/rafiqul', secure_url: IMAGES.md, alt: 'Rafiqul Karim, Lead Full-Stack Engineer' },
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    isLeadership: false,
    published: true,
    order: 5,
  },
  {
    name: 'Farhan Chowdhury',
    slug: 'farhan-chowdhury',
    position: 'Mobile Engineering Lead',
    department: 'Mobile',
    bio: 'Leads cross-platform React Native and Flutter engineering with deep expertise in offline sync and biometric mobile banking UX.',
    skills: ['React Native', 'Flutter', 'TypeScript', 'Mobile Security'],
    experienceYears: 8,
    image: { public_id: 'seed/team/farhan', secure_url: IMAGES.lead, alt: 'Farhan Chowdhury, Mobile Engineering Lead' },
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    isLeadership: false,
    published: true,
    order: 6,
  },
];

const seedTestimonials = [
  {
    clientName: 'Mahmudul Hasan',
    role: 'Director of Operations',
    company: 'Bengal Thread Apparel Group',
    industry: 'Retail & E-commerce',
    quote: 'Before Trust IT, our 28 outlets and online store ran on disconnected spreadsheets. Their unified ERP eliminated phantom stockouts and lifted our online conversion by 42% within one quarter.',
    outcomeMetric: '+42% Online Conversion in 90 Days',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    clientName: 'Farhana Yasmin',
    role: 'Head of Digital Banking',
    company: 'Meghna Financial Services Ltd.',
    industry: 'Finance',
    quote: 'We needed an enterprise treasury portal that could pass central-bank-grade security reviews. Trust IT cut our corporate settlement cycle from 72 hours to 12 minutes with a spotless audit record.',
    outcomeMetric: '72 hrs → 12 min Settlement Cycle',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    clientName: 'Dr. Kamrul Ahsan',
    role: 'Chief Operating Officer',
    company: 'CareLine Specialized Hospital',
    industry: 'Healthcare',
    quote: 'Their team migrated 1.4 million patient records onto a resilient cloud EMR without interrupting our 24/7 clinical operations. Patient reception wait times fell by 60%.',
    outcomeMetric: '-60% Patient Wait Time',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    clientName: 'Ashraful Alam',
    role: 'Managing Director',
    company: 'Apex Express Bangladesh',
    industry: 'Logistics',
    quote: 'Our previous courier software stalled whenever daily parcel volume crossed 10,000. Trust IT rebuilt our hub engine and rider app—now we process 22,000+ parcels daily at 97.4% SLA.',
    outcomeMetric: '97.4% Delivery SLA Across 64 Districts',
    rating: 5,
    featured: false,
    published: true,
  },
  {
    clientName: 'Prof. Anwar Hossain',
    role: 'Principal',
    company: 'Dhaka International Academy',
    industry: 'Education',
    quote: 'Trust IT digitized our entire fee collection and exam grading lifecycle. Today 92% of parents pay tuition digitally and term transcripts are generated in one day instead of three weeks.',
    outcomeMetric: '92% Digital Tuition Adoption',
    rating: 5,
    featured: false,
    published: true,
  },
  {
    clientName: 'Elena Vance',
    role: 'VP of Engineering',
    company: 'NordicBridge Commerce (UK)',
    industry: 'International SaaS',
    quote: 'Working with Trust IT’s Dhaka engineering squad felt like having an in-house product team. Their TypeScript and cloud architecture discipline matched our London standards seamlessly.',
    outcomeMetric: '99.98% Production API Uptime',
    rating: 5,
    featured: true,
    published: true,
  },
];

const seedFaqs = [
  {
    question: 'What makes Trust IT different from other IT companies in Bangladesh?',
    answer: 'With 12+ years of continuous delivery and 500+ completed projects, we combine senior systems architecture, transparent milestone-based project management, and dedicated post-launch SLAs—rather than outsourcing or shipping fragile templates.',
    category: 'Company',
    order: 1,
    published: true,
  },
  {
    question: 'Do you work with international clients as well as Bangladeshi enterprises?',
    answer: 'Yes. While our engineering headquarters is in Banani, Dhaka serving major Bangladeshi enterprises, startups, and institutions, we also partner with clients across the UK, North America, the Middle East, and Singapore.',
    category: 'Company',
    order: 2,
    published: true,
  },
  {
    question: 'How do you price custom software and web development projects?',
    answer: 'We offer fixed-scope milestone pricing for well-defined projects and dedicated monthly engineering squads for evolving products. Every engagement begins with a complimentary discovery audit and itemized technical proposal.',
    category: 'Pricing',
    order: 3,
    published: true,
  },
  {
    question: 'Do we get full ownership of the source code and cloud accounts?',
    answer: 'Yes, 100%. All repositories, database schemas, design files, and cloud infrastructure are deployed directly under your organization’s ownership upon milestone completion.',
    category: 'Process',
    order: 4,
    published: true,
  },
  {
    question: 'Can you integrate local Bangladeshi payment gateways and courier APIs?',
    answer: 'Absolutely. We have production-tested integrations for bKash, Nagad, SSLCommerz, aamarpay, local bank APIs, Pathao Courier, Steadfast, RedX, and Paperfly.',
    category: 'Technical',
    order: 5,
    published: true,
  },
  {
    question: 'What kind of post-launch support and maintenance do you provide?',
    answer: 'Every custom project includes a warranty stabilization period, followed by optional 24/7 SLA maintenance plans covering uptime monitoring, security patching, automated backups, and continuous enhancements.',
    category: 'Support',
    order: 6,
    published: true,
  },
  {
    question: 'How do you handle application security and data protection?',
    answer: 'We follow OWASP Top 10 standards, implement strict role-based access control, JWT/HTTP-only session hardening, input validation, rate limiting, encrypted backups, and pre-launch security reviews.',
    category: 'Security',
    order: 7,
    published: true,
  },
  {
    question: 'How quickly can we start a new project with Trust IT?',
    answer: 'Discovery workshops can begin within 48 hours of inquiry, and dedicated engineering sprints typically kick off within 1–2 weeks of scope sign-off.',
    category: 'Process',
    order: 8,
    published: true,
  },
];

const seedCareers = [
  {
    title: 'Senior Full-Stack Engineer (Next.js & Node.js)',
    slug: 'senior-full-stack-engineer-nextjs-nodejs',
    department: 'Engineering',
    location: 'Banani, Dhaka (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '৳110,000 – ৳165,000 / month',
    experience: '4+ Years',
    summary: 'Architect and ship enterprise web applications, REST APIs, and scalable MongoDB/PostgreSQL backends for flagship Bangladeshi and global clients.',
    requirements: [
      '4+ years of production experience with TypeScript, React/Next.js, and Node.js/Express',
      'Strong mastery of MongoDB aggregation, PostgreSQL schema design, and indexing',
      'Experience with JWT authentication, RBAC, and REST API security best practices',
      'Clear written communication and mentorship habits for code reviews',
    ],
    responsibilities: [
      'Lead technical design and implementation for client web platforms',
      'Write clean, modular, type-safe frontend and backend services',
      'Collaborate with UI/UX designers and cloud engineers on performance optimization',
      'Review pull requests and guide mid-level engineers',
    ],
    benefits: [
      'Two festival bonuses + annual performance review',
      'Health insurance coverage & subsidized lunch',
      'Flexible hybrid schedule & annual learning budget',
    ],
    status: 'OPEN',
    publishedAt: '2026-10-20T09:00:00.000Z',
  },
  {
    title: 'Cloud & DevOps Engineer (AWS / Docker)',
    slug: 'cloud-devops-engineer-aws-docker',
    department: 'Cloud & Security',
    location: 'Banani, Dhaka (On-site)',
    employmentType: 'Full-Time',
    salaryRange: '৳95,000 – ৳145,000 / month',
    experience: '3+ Years',
    summary: 'Design automated CI/CD pipelines, harden Linux/Docker infrastructure, and monitor 99.95% SLA production workloads.',
    requirements: [
      'Hands-on production experience with AWS (EC2, ECS, RDS, S3, CloudWatch) or GCP',
      'Proficiency in Docker, GitHub Actions, Nginx, and Terraform',
      'Solid understanding of networking, SSL, WAF, and Linux security hardening',
    ],
    responsibilities: [
      'Automate zero-downtime deployment pipelines across staging and production',
      'Monitor infrastructure health, latency, and backup integrity',
      'Optimize monthly cloud spending through right-sizing and caching',
    ],
    benefits: [
      'AWS / GCP certification exam sponsorship',
      'Two festival bonuses & medical insurance',
      'Modern Banani office with dedicated workstation setup',
    ],
    status: 'OPEN',
    publishedAt: '2026-10-15T09:00:00.000Z',
  },
  {
    title: 'Senior Product UI/UX Designer',
    slug: 'senior-product-ui-ux-designer',
    department: 'UI/UX Design',
    location: 'Banani, Dhaka (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '৳80,000 – ৳125,000 / month',
    experience: '3+ Years',
    summary: 'Craft clear, accessible enterprise dashboards, SaaS workflows, and high-converting corporate web experiences.',
    requirements: [
      'Strong portfolio showcasing complex B2B web apps or enterprise systems in Figma',
      'Deep grasp of design tokens, responsive grids, and WCAG accessibility contrast',
      'Ability to conduct stakeholder interviews and translate workflows into clean UI',
    ],
    responsibilities: [
      'Own end-to-end UX discovery, wireframing, and high-fidelity Figma systems',
      'Partner closely with frontend engineers using Tailwind CSS conventions',
      'Run usability reviews on live staging builds',
    ],
    benefits: [
      'Collaborative design culture with real enterprise impact',
      'Annual hardware & design tool allowance',
      'Two festival bonuses & health coverage',
    ],
    status: 'OPEN',
    publishedAt: '2026-10-10T09:00:00.000Z',
  },
  {
    title: 'Software Quality Assurance (SQA) Engineer',
    slug: 'software-quality-assurance-engineer',
    department: 'Quality Engineering',
    location: 'Banani, Dhaka (On-site)',
    employmentType: 'Full-Time',
    salaryRange: '৳60,000 – ৳90,000 / month',
    experience: '2+ Years',
    summary: 'Ensure zero-regression releases through structured test plans, API validation, and end-to-end browser automation.',
    requirements: [
      '2+ years testing web, mobile, and REST API applications',
      'Experience with Playwright or Cypress and Postman API test suites',
      'Strong attention to edge cases, security checks, and responsive layouts',
    ],
    responsibilities: [
      'Author test cases and maintain automated regression suites',
      'Verify API contracts, form validations, and role permissions',
      'Sign off on production sprint releases',
    ],
    benefits: [
      'Clear progression to QA Lead or SDET track',
      'Two festival bonuses & health insurance',
      'Supportive engineering team',
    ],
    status: 'OPEN',
    publishedAt: '2026-10-01T09:00:00.000Z',
  },
];

const defaultSettings = {
  companyName: 'Trust IT',
  tagline: 'Social Media Solutions · Technology You Can Trust',
  altTagline: 'Your Vision, Our Strategy — Creative Solutions, Digital Growth & Lasting Success',
  experienceYears: 12,
  heroHeadline: 'Building Digital & Social Solutions You Can Trust',
  heroSubheadline:
    'With 12+ years of experience, Trust IT delivers reliable web development, custom software, social media solutions, graphic design, SEO, and business automation.',
  phone: '+880 1946-006100',
  email: 'hello@trustit.com',
  whatsapp: '+8801946006100',
  address: 'Banani, Dhaka 1213, Bangladesh · www.trustit.com',
  businessHours: '24/7 Support · Office Sun–Thu 9:30 AM – 6:30 PM (BST)',
  socialLinks: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    github: 'https://github.com',
  },
  stats: {
    yearsExperience: 12,
    projectsCompleted: 500,
    happyClients: 300,
    professionals: 50,
    clientSatisfaction: 98,
  },
  clientLogos: [
    { id: 'c1', name: 'Meghna Financial', sector: 'Banking & FinTech' },
    { id: 'c2', name: 'Bengal Thread Group', sector: 'Retail & Apparel' },
    { id: 'c3', name: 'CareLine Hospital', sector: 'Healthcare' },
    { id: 'c4', name: 'Apex Express BD', sector: 'Logistics' },
    { id: 'c5', name: 'Padma Agro Ltd.', sector: 'Manufacturing' },
    { id: 'c6', name: 'NordicBridge UK', sector: 'Global SaaS' },
  ],
  seoDefaults: {
    siteTitle: 'Trust IT — Building Digital Solutions You Can Trust | IT Company in Bangladesh',
    metaDescription:
      'Trust IT is a premier Bangladeshi IT company with 12+ years of experience delivering web development, custom software, cloud engineering, and cybersecurity.',
    keywords: [
      'IT Company in Bangladesh',
      'Software Company in Bangladesh',
      'Web Development Company Bangladesh',
      'Digital Solutions Bangladesh',
      'Web Development Company in Dhaka',
    ],
  },
};

export async function runSeedIfEmpty(): Promise<void> {
  // Optional env-driven admin bootstrap when zero admins exist
  const adminCount = await repos.admins.count();
  if (adminCount === 0 && env.adminSeedEmail && env.adminSeedPassword) {
    const passwordHash = await bcrypt.hash(env.adminSeedPassword, 12);
    await repos.admins.create({
      email: env.adminSeedEmail.toLowerCase(),
      passwordHash,
      name: env.adminSeedName,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log('[Seed] Initial Super Admin bootstrapped from environment config');
  }

  if ((await repos.websiteSettings.count()) === 0) {
    await repos.websiteSettings.create(defaultSettings);
  } else {
    const existingSettings = await repos.websiteSettings.findOne({});
    if (existingSettings && existingSettings.phone === '+880 1711-000000') {
      await repos.websiteSettings.updateById(existingSettings._id, {
        tagline: defaultSettings.tagline,
        altTagline: defaultSettings.altTagline,
        heroHeadline: defaultSettings.heroHeadline,
        heroSubheadline: defaultSettings.heroSubheadline,
        phone: defaultSettings.phone,
        email: defaultSettings.email,
        whatsapp: defaultSettings.whatsapp,
        address: defaultSettings.address,
        businessHours: defaultSettings.businessHours,
      });
    }
  }
  if ((await repos.serviceCategories.count()) === 0) {
    for (const cat of seedServiceCategories) await repos.serviceCategories.create(cat);
  }
  const existingServices = await repos.services.findAll({ limit: 50 });
  const smmService = existingServices.items.find((s: any) => s.slug === 'social-media-marketing');
  const needsServiceUpgrade =
    existingServices.total === 0 ||
    existingServices.items.some((s: any) => !s.filterGroup || !s.status) ||
    !smmService?.packages?.length;
  if (needsServiceUpgrade) {
    await repos.services.clearAll();
    for (const s of seedServices) await repos.services.create(s);
    console.log('[Seed] Services catalog initialized/upgraded with Social Media Solutions & full 16 practices');
  }
  if ((await repos.solutions.count()) === 0) {
    for (const sol of seedSolutions) await repos.solutions.create(sol);
  }
  if ((await repos.industries.count()) === 0) {
    for (const ind of seedIndustries) await repos.industries.create(ind);
  }
  if ((await repos.projects.count()) === 0) {
    for (const p of seedProjects) await repos.projects.create(p);
  }
  if ((await repos.caseStudies.count()) === 0) {
    for (const cs of seedCaseStudies) await repos.caseStudies.create(cs);
  }
  if ((await repos.categories.count()) === 0) {
    for (const cat of seedCategories) await repos.categories.create(cat);
  }
  if ((await repos.blogPosts.count()) === 0) {
    for (const post of seedBlogPosts) await repos.blogPosts.create(post);
  }
  if ((await repos.teamMembers.count()) === 0) {
    for (const member of seedTeam) await repos.teamMembers.create(member);
  }
  if ((await repos.testimonials.count()) === 0) {
    for (const t of seedTestimonials) await repos.testimonials.create(t);
  }
  if ((await repos.faqs.count()) === 0) {
    for (const f of seedFaqs) await repos.faqs.create(f);
  }
  if ((await repos.careers.count()) === 0) {
    for (const c of seedCareers) await repos.careers.create(c);
  }
}
