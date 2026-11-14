import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Clock,
  Headphones,
  MessageSquare,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface PlatformCard {
  id: string;
  name: string;
  subtitle: string;
  accentBorder: string;
  accentText: string;
  items: string[];
}

const PLATFORMS: PlatformCard[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    subtitle: 'Pages, Profiles & Campaigns',
    accentBorder: 'border-blue-500/40',
    accentText: 'text-blue-400',
    items: [
      'Bangladeshi & Global Followers',
      'Page Likes & Post Likes',
      'Comments, Shares & Video Views',
      'Page Review & Trust Campaigns',
      'Events Responses & Group Members',
      'Meta Ads & Custom Packages',
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    subtitle: 'Reels, Stories & Creators',
    accentBorder: 'border-pink-500/40',
    accentText: 'text-pink-400',
    items: [
      'Profile Followers & Post Likes',
      'Reels Views & Story Views',
      'Comments & Content Saves',
      'Profile Visits & Highlights',
      'Branded Carousel Design',
      'Custom Growth Packages',
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    subtitle: 'Short-Form Viral Reach',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    items: [
      'Account Followers & Video Likes',
      'Video Views & Viral Shares',
      'Video Saves & Profile Visits',
      'Comments & Live Viewers / Likes',
      'Short-Form Video Editing',
      'Custom Creator Packages',
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    subtitle: 'Channels, Shorts & Video SEO',
    accentBorder: 'border-red-500/40',
    accentText: 'text-red-400',
    items: [
      'Channel Subscribers & Watch Time',
      'Video Views & Post Likes',
      'Comments & Playlist Plays',
      'Live Stream Viewers & Shares',
      'YouTube Video SEO & Thumbnails',
      'Custom Channel Packages',
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    subtitle: 'B2B Authority & Corporate Growth',
    accentBorder: 'border-sky-500/40',
    accentText: 'text-sky-400',
    items: [
      'Personal & Company Followers',
      'Post Likes, Comments & Shares',
      'Executive Profile Views',
      'Targeted Connection Outreach',
      'Skill Endorsements & Branding',
      'Custom B2B Packages',
    ],
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    subtitle: 'Real-Time Brand Visibility',
    accentBorder: 'border-slate-500/50',
    accentText: 'text-slate-300',
    items: [
      'Account Followers & Tweet Likes',
      'Retweets, Replies & Bookmarks',
      'Post Views & Profile Visits',
      'Impression Boost Campaigns',
      'Launch Thread Promotion',
      'Custom Campaign Packages',
    ],
  },
];

const AUDIENCE_PLANS = {
  bangladeshi: {
    label: 'Bangladeshi Audience',
    caption: 'Targeted growth tailored for Dhaka & nationwide local buyers',
    tiers: [
      { volume: '5K Followers', subtitle: 'Starter Local Presence', price: '৳1,199' },
      { volume: '10K Followers', subtitle: 'Growing Business Page', price: '৳2,199' },
      { volume: '20K Followers', subtitle: 'Established Brand Authority', price: '৳3,850' },
      { volume: '50K Followers', subtitle: 'High-Volume Flagship Page', price: '৳6,500' },
    ],
  },
  global: {
    label: 'Global Audience',
    caption: 'Worldwide social proof and international reach at entry-friendly pricing',
    tiers: [
      { volume: '1K Followers', subtitle: 'Launch Starter', price: '৳200' },
      { volume: '5K Followers', subtitle: 'Creator & Shop Growth', price: '৳499' },
      { volume: '10K Followers', subtitle: 'Multi-Market Credibility', price: '৳999' },
      { volume: '30K Followers', subtitle: 'Large Scale Social Proof', price: '৳2,299' },
    ],
  },
};

const SIGNATURE_PACKS = [
  {
    title: 'Facebook Page Review & Trust',
    price: '৳599',
    note: 'Starting Price · 100% Safe & Non-Drop',
    summary: 'Strengthen local customer trust and page star ratings so new visitors message and order with confidence.',
    points: [
      'Real & active page recommendation reviews',
      'Boosts brand credibility & buyer trust',
      'Improves page visibility & conversion signals',
      'Fast delivery with 24/7 WhatsApp support',
    ],
    packageParam: 'FB Page Review & Trust (৳599)',
    highlight: false,
  },
  {
    title: 'Facebook Engagement Booster',
    price: '৳590',
    note: 'Offer Package · Multi-Signal Pack',
    summary: 'Balanced growth bundle combining followers, video views, post likes, comments, and shares in one order.',
    points: [
      '5,000 Followers + 5,000 Video Views',
      '500 Post Likes + 20 Comments + 100 Shares',
      'Non-drop lifetime safety guarantee',
      'Fast campaign kickoff & WhatsApp tracking',
    ],
    packageParam: 'Facebook Engagement Pack (৳590)',
    highlight: true,
  },
  {
    title: 'Organic Post Reach & Likes',
    price: '৳490',
    note: 'Viral Post Pack · 10,000 Post Likes',
    summary: 'Amplify priority product posts, offers, and announcements so campaigns attract immediate social proof.',
    points: [
      '10,000 Real & Safe Post Likes',
      'Boosts post popularity & social proof',
      'Fast delivery with safety guarantee',
      'Ideal before launching Meta Paid Ads',
    ],
    packageParam: '10K Post Likes Pack (৳490)',
    highlight: false,
  },
];

const GRAPHIC_DESIGN_ITEMS = [
  'Logo Design & Brand Identity',
  'Business Card & Stationery',
  'Social Media Post Design',
  'Flyer & Promotional Design',
  'Photo Collages & Retouching',
  'Birthday & Event Cards',
  'Executive CV & Portfolio Maker',
  'Reels & Video Editing',
];

export function SocialMediaPackagesSection({ compact = false }: { compact?: boolean }) {
  const { settings } = useSiteSettings();
  const [audienceRegion, setAudienceRegion] = useState<'bangladeshi' | 'global'>('bangladeshi');
  const waNumber = (settings.whatsapp || '+8801946006100').replace(/[^0-9]/g, '');

  const makeWhatsAppLink = (pkgName: string) =>
    `https://wa.me/${waNumber}?text=${encodeURIComponent(
      `Hello Trust IT, I would like to order or learn more about: ${pkgName}`
    )}`;

  const activeAudience = AUDIENCE_PLANS[audienceRegion];

  return (
    <section className="py-20 bg-slate-950 text-white border-t border-slate-800" id="social-media-solutions">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header Band */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold text-amber-400 tracking-wide inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Trust IT · Social Media Solutions
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
              One-Stop Solutions for Every Social Platform &amp; Creative Need
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your Vision, Our Strategy — grow across Facebook, Instagram, TikTok, YouTube, LinkedIn, and X (Twitter) with transparent packages, custom graphic design, video editing, and 24/7 support.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/services/social-media-marketing"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              View Full Social Practice
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={makeWhatsAppLink('Custom Social Media Package')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border border-slate-700 text-white rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp {settings.phone || '01946006100'}
            </a>
          </div>
        </div>

        {/* 6-Platform Social Media Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORMS.map((plat) => (
            <div
              key={plat.id}
              className={`bg-slate-900/90 border ${plat.accentBorder} rounded-xl p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className={`text-lg font-bold ${plat.accentText}`}>{plat.name}</h3>
                    <p className="text-xs text-slate-400">{plat.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Custom Packages</span>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-200">
                  {plat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${plat.accentText}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <Link
                  to={`/contact?service=${encodeURIComponent('Social Media Solutions & Marketing')}&package=${encodeURIComponent(
                    `${plat.name} Services`
                  )}`}
                  className="font-semibold text-white hover:text-amber-400 inline-flex items-center gap-1"
                >
                  Order {plat.name} Package <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Signature Growth & Review Packs */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-1">Most Requested Offers</p>
              <h3 className="text-2xl font-bold text-white">Popular Social Growth &amp; Review Packages</h3>
            </div>
            <p className="text-xs text-slate-400">Custom multi-platform bundles available on request</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {SIGNATURE_PACKS.map((pack) => (
              <div
                key={pack.title}
                className={`rounded-xl p-6 flex flex-col justify-between border ${
                  pack.highlight
                    ? 'bg-slate-900 border-amber-500/60 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-white">{pack.title}</h4>
                    {pack.highlight && (
                      <span className="text-[11px] font-semibold text-amber-400 inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> Best Value
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-amber-400 tabular-nums">{pack.price}</p>
                  <p className="text-xs text-slate-400 mt-1">{pack.note}</p>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">{pack.summary}</p>

                  <ul className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-200">
                    {pack.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  <Link
                    to={`/contact?service=${encodeURIComponent('Social Media Solutions & Marketing')}&package=${encodeURIComponent(
                      pack.packageParam
                    )}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors"
                  >
                    Order Now
                  </Link>
                  <a
                    href={makeWhatsAppLink(pack.packageParam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold border border-slate-700 text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Tier Explorer (Bangladeshi vs Global) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white inline-flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Page Audience Growth Plans
              </h3>
              <p className="text-xs text-slate-400 mt-1">{activeAudience.caption}</p>
            </div>

            <div className="inline-flex bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAudienceRegion('bangladeshi')}
                className={`px-3.5 py-2 rounded-md cursor-pointer transition-colors ${
                  audienceRegion === 'bangladeshi'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Bangladeshi Audience
              </button>
              <button
                type="button"
                onClick={() => setAudienceRegion('global')}
                className={`px-3.5 py-2 rounded-md cursor-pointer transition-colors ${
                  audienceRegion === 'global'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Global Audience
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeAudience.tiers.map((tier) => {
              const pkgLabel = `${activeAudience.label} — ${tier.volume} (${tier.price})`;
              return (
                <div
                  key={tier.volume}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs text-slate-400">{tier.subtitle}</p>
                    <p className="text-lg font-bold text-white mt-1 tabular-nums">{tier.volume}</p>
                    <p className="text-2xl font-extrabold text-amber-400 mt-2 tabular-nums">{tier.price}</p>
                  </div>
                  <Link
                    to={`/contact?service=${encodeURIComponent('Social Media Solutions & Marketing')}&package=${encodeURIComponent(
                      pkgLabel
                    )}`}
                    className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-sky-400 hover:text-sky-300 pt-3 border-t border-slate-800"
                  >
                    <span>Select Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphic Design & Video Studio Strip */}
        {!compact && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-1.5 inline-flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Trust IT Creative Studio
                </p>
                <h3 className="text-xl font-bold text-white">Graphic Design, Content Writing &amp; Branding</h3>
                <p className="text-xs text-slate-300 mt-1.5">
                  Complete visual assets for businesses, creators, and professionals crafted in-house.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                {GRAPHIC_DESIGN_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  to="/services/ui-ux-design"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Explore Design &amp; Branding Service <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-sky-400 inline-flex items-center gap-1.5">
                  <Clapperboard className="w-4 h-4" /> Video Editing &amp; Full-Stack Digital
                </p>
                <h3 className="text-xl font-bold text-white">7 Integrated Growth Divisions</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Combine Social Media Solutions with custom Websites, Software/CRM Automation, Video Editing, Managed IT, and Virtual Operations under one accountable team.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Safe &amp; Reliable</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fast Delivery</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>24/7 Support</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custom Packages</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
