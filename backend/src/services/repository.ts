import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Model } from 'mongoose';
import { isMongoConnected } from '../config/db.ts';
import {
  AdminModel,
  BlogPostModel,
  CareerModel,
  CaseStudyModel,
  CategoryModel,
  ContactMessageModel,
  FAQModel,
  IndustryModel,
  JobApplicationModel,
  NewsletterSubscriberModel,
  ProjectModel,
  ServiceCategoryModel,
  ServiceModel,
  SolutionModel,
  TeamMemberModel,
  TestimonialModel,
  WebsiteSettingModel,
} from '../models/index.ts';

export type CollectionName =
  | 'admins'
  | 'serviceCategories'
  | 'services'
  | 'solutions'
  | 'industries'
  | 'projects'
  | 'caseStudies'
  | 'blogPosts'
  | 'categories'
  | 'teamMembers'
  | 'testimonials'
  | 'faqs'
  | 'careers'
  | 'jobApplications'
  | 'contactMessages'
  | 'websiteSettings'
  | 'newsletterSubscribers';

const modelMap: Record<CollectionName, Model<any>> = {
  admins: AdminModel,
  serviceCategories: ServiceCategoryModel,
  services: ServiceModel,
  solutions: SolutionModel,
  industries: IndustryModel,
  projects: ProjectModel,
  caseStudies: CaseStudyModel,
  blogPosts: BlogPostModel,
  categories: CategoryModel,
  teamMembers: TeamMemberModel,
  testimonials: TestimonialModel,
  faqs: FAQModel,
  careers: CareerModel,
  jobApplications: JobApplicationModel,
  contactMessages: ContactMessageModel,
  websiteSettings: WebsiteSettingModel,
  newsletterSubscribers: NewsletterSubscriberModel,
};

type StoreData = Record<CollectionName, any[]>;

const STORE_PATH = path.resolve(process.cwd(), 'backend', 'data', 'store.json');

let memoryStore: StoreData | null = null;

function createEmptyStore(): StoreData {
  return {
    admins: [],
    serviceCategories: [],
    services: [],
    solutions: [],
    industries: [],
    projects: [],
    caseStudies: [],
    blogPosts: [],
    categories: [],
    teamMembers: [],
    testimonials: [],
    faqs: [],
    careers: [],
    jobApplications: [],
    contactMessages: [],
    websiteSettings: [],
    newsletterSubscribers: [],
  };
}

function loadStore(): StoreData {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryStore = { ...createEmptyStore(), ...parsed };
      return memoryStore!;
    }
  } catch {
    // Reinitialize if store file is malformed
  }
  memoryStore = createEmptyStore();
  return memoryStore;
}

function saveStore(store: StoreData): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function matchesFilter(doc: any, filter: Record<string, any>): boolean {
  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined) continue;
    if (key === '$or' && Array.isArray(value)) {
      const ok = value.some((sub) => matchesFilter(doc, sub));
      if (!ok) return false;
      continue;
    }
    const docVal = doc[key];
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof RegExp)) {
      if ('$regex' in value) {
        const regex = new RegExp(value.$regex, value.$options || 'i');
        if (Array.isArray(docVal)) {
          if (!docVal.some((v) => regex.test(String(v)))) return false;
        } else if (!regex.test(String(docVal ?? ''))) {
          return false;
        }
        continue;
      }
      if ('$in' in value && Array.isArray(value.$in)) {
        if (Array.isArray(docVal)) {
          if (!docVal.some((v) => value.$in.includes(v))) return false;
        } else if (!value.$in.includes(docVal)) {
          return false;
        }
        continue;
      }
    }
    if (Array.isArray(docVal) && typeof value === 'string') {
      if (!docVal.includes(value)) return false;
    } else if (docVal !== value) {
      return false;
    }
  }
  return true;
}

function sortRecords(items: any[], sortObj?: Record<string, 1 | -1>): any[] {
  if (!sortObj) return items;
  const entries = Object.entries(sortObj);
  if (entries.length === 0) return items;
  return [...items].sort((a, b) => {
    for (const [field, dir] of entries) {
      const av = a[field];
      const bv = b[field];
      if (av === bv) continue;
      if (av === undefined || av === null) return 1;
      if (bv === undefined || bv === null) return -1;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
    }
    return 0;
  });
}

export interface QueryOptions {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  page?: number;
  limit?: number;
}

export class Repository<T extends Record<string, any>> {
  private collection: CollectionName;
  private model: Model<any>;

  constructor(collection: CollectionName) {
    this.collection = collection;
    this.model = modelMap[collection];
  }

  async findAll(options: QueryOptions = {}): Promise<{ items: T[]; total: number; page: number; pages: number }> {
    const { filter = {}, sort = { createdAt: -1 }, page = 1, limit = 100 } = options;

    if (isMongoConnected()) {
      const total = await this.model.countDocuments(filter);
      const safeLimit = Math.min(Math.max(limit, 1), 200);
      const safePage = Math.max(page, 1);
      const docs = await this.model
        .find(filter)
        .sort(sort)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean();
      return {
        items: docs.map((d: any) => ({ ...d, _id: String(d._id) })) as T[],
        total,
        page: safePage,
        pages: Math.max(1, Math.ceil(total / safeLimit)),
      };
    }

    const store = loadStore();
    const filtered = store[this.collection].filter((doc) => matchesFilter(doc, filter));
    const sorted = sortRecords(filtered, sort);
    const total = sorted.length;
    const safeLimit = Math.min(Math.max(limit, 1), 200);
    const safePage = Math.max(page, 1);
    const start = (safePage - 1) * safeLimit;
    const items = sorted.slice(start, start + safeLimit) as T[];
    return {
      items,
      total,
      page: safePage,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  async findOne(filter: Record<string, any>): Promise<T | null> {
    if (isMongoConnected()) {
      const doc = await this.model.findOne(filter).lean();
      return doc ? ({ ...doc, _id: String((doc as any)._id) } as T) : null;
    }
    const store = loadStore();
    const found = store[this.collection].find((doc) => matchesFilter(doc, filter));
    return (found as T) || null;
  }

  async findById(id: string): Promise<T | null> {
    if (isMongoConnected()) {
      try {
        const doc = await this.model.findById(id).lean();
        return doc ? ({ ...doc, _id: String((doc as any)._id) } as T) : null;
      } catch {
        return null;
      }
    }
    return this.findOne({ _id: id });
  }

  async create(payload: Partial<T>): Promise<T> {
    if (isMongoConnected()) {
      const created = await this.model.create(payload);
      const obj = created.toObject();
      return { ...obj, _id: String(obj._id) } as T;
    }

    const store = loadStore();
    const now = new Date().toISOString();
    const newItem = {
      ...payload,
      _id: (payload as any)._id || crypto.randomBytes(12).toString('hex'),
      createdAt: (payload as any).createdAt || now,
      updatedAt: now,
    } as unknown as T;
    store[this.collection].push(newItem);
    saveStore(store);
    return newItem;
  }

  async updateById(id: string, updates: Partial<T>): Promise<T | null> {
    if (isMongoConnected()) {
      try {
        const updated = await this.model.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
        return updated ? ({ ...updated, _id: String((updated as any)._id) } as T) : null;
      } catch {
        return null;
      }
    }

    const store = loadStore();
    const idx = store[this.collection].findIndex((doc) => doc._id === id);
    if (idx === -1) return null;
    const updated = {
      ...store[this.collection][idx],
      ...updates,
      _id: id,
      updatedAt: new Date().toISOString(),
    };
    store[this.collection][idx] = updated;
    saveStore(store);
    return updated as T;
  }

  async deleteById(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      try {
        const res = await this.model.findByIdAndDelete(id);
        return Boolean(res);
      } catch {
        return false;
      }
    }

    const store = loadStore();
    const initialLen = store[this.collection].length;
    store[this.collection] = store[this.collection].filter((doc) => doc._id !== id);
    if (store[this.collection].length === initialLen) return false;
    saveStore(store);
    return true;
  }

  async clearAll(): Promise<void> {
    if (isMongoConnected()) {
      await this.model.deleteMany({});
      return;
    }
    const store = loadStore();
    store[this.collection] = [];
    saveStore(store);
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    if (isMongoConnected()) {
      return this.model.countDocuments(filter);
    }
    const store = loadStore();
    return store[this.collection].filter((doc) => matchesFilter(doc, filter)).length;
  }
}

export const repos = {
  admins: new Repository<any>('admins'),
  serviceCategories: new Repository<any>('serviceCategories'),
  services: new Repository<any>('services'),
  solutions: new Repository<any>('solutions'),
  industries: new Repository<any>('industries'),
  projects: new Repository<any>('projects'),
  caseStudies: new Repository<any>('caseStudies'),
  blogPosts: new Repository<any>('blogPosts'),
  categories: new Repository<any>('categories'),
  teamMembers: new Repository<any>('teamMembers'),
  testimonials: new Repository<any>('testimonials'),
  faqs: new Repository<any>('faqs'),
  careers: new Repository<any>('careers'),
  jobApplications: new Repository<any>('jobApplications'),
  contactMessages: new Repository<any>('contactMessages'),
  websiteSettings: new Repository<any>('websiteSettings'),
  newsletterSubscribers: new Repository<any>('newsletterSubscribers'),
};
