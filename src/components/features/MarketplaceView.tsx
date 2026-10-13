"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Filter as FilterIcon, SlidersHorizontal, RefreshCw } from "lucide-react";
import { NavBar } from "@/components/features/NavBar";
import { useAuthSafe } from "@/lib/AuthContext";
import { FilterSidebar, FilterState } from "@/components/features/FilterSidebar";
import { SkillCard, SkillCardSkeleton } from "@/components/features/SkillCard";
import { AdCard } from "@/components/features/AdCard";
import { LoginModal } from "@/components/features/LoginModal";
import { RequestSkillModal } from "@/components/features/RequestSkillModal";
import { Footer } from "@/components/features/Footer";
import { useScrollLock } from "@/lib/useScrollLock";
import styles from "./MarketplaceView.module.css";

export interface SkillItem {
  id: string;
  title: string;
  version: string;
  price: string;
  isFree: boolean;
  isFeatured?: boolean;
  description: string;
  installPrompt: string;
  previewImage: string;
  models: string[];
  roles: string[];
  output: string;
  useCase: string;
  category: string;
  installs?: number;
  rating?: number;
  createdAt?: string;
}

export const MARKETPLACE_SKILLS: SkillItem[] = [
  {
    id: "visual-canvas-deck",
    title: "Visual Canvas Deck",
    version: "v1.0.1",
    price: "$5",
    isFree: false,
    isFeatured: true,
    description: "Create an exploratory presentation that turns a rough brief into editable spatial compositions and a coherent deck. It supports visual iteration through addressable canvases, clear outline approval, and a browser-ready presentation. Every deck can be edited in the browser and exported as an editable PowerPoint file.",
    installPrompt: "npx skillhouse add visual-canvas-deck",
    previewImage: "/figma/node_751_5606.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["founder", "consultant", "designer"],
    output: "slides",
    useCase: "sales-fundraising",
    category: "Presentations",
    installs: 295,
    rating: 4.9,
    createdAt: "2026-10-12",
  },
  {
    id: "pixel-promo-video",
    title: "Pixel Promo Video",
    version: "2.4.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Generates cinematic 4K video promos, animated kinetic text, and product reels directly from prompt specifications.",
    installPrompt: "npx create-agent-skill pixel-promo-video",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-codex.png",
    ],
    roles: ["content-creator", "marketer", "designer"],
    output: "video",
    useCase: "product-launch",
    category: "Video & Media",
    installs: 4820,
    rating: 4.9,
    createdAt: "2026-10-10",
  },
  {
    id: "web-dev-pro",
    title: "Web Development Pro",
    version: "1.0.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Generates modern responsive websites using clean HTML, CSS, and TypeScript with optimal performance and SEO best practices.",
    installPrompt: "npx create-agent-skill web-dev-pro",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["swe", "founder"],
    output: "web",
    useCase: "web-design",
    category: "Engineering",
    installs: 3910,
    rating: 4.8,
    createdAt: "2026-10-09",
  },
  {
    id: "brand-identity-designer",
    title: "Brand Identity Designer",
    version: "2.1.0",
    price: "$19",
    isFree: false,
    isFeatured: true,
    description: "Synthesizes harmonious color palettes, typography scales, logo systems, and visual guidelines into an exportable design token set.",
    installPrompt: "npx create-agent-skill brand-identity-designer",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-gemini.png",
    ],
    roles: ["designer", "founder"],
    output: "image",
    useCase: "brand-identity",
    category: "Design",
    installs: 2750,
    rating: 4.9,
    createdAt: "2026-10-08",
  },
  {
    id: "social-media-strategist",
    title: "Social Media Strategist",
    version: "1.2.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Crafts high-converting multi-platform social media posts, threads, and newsletters calibrated precisely to your audience voice.",
    installPrompt: "npx create-agent-skill social-media-strategist",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-cursor.png",
    ],
    roles: ["marketer", "content-creator"],
    output: "slides",
    useCase: "social-media",
    category: "Marketing",
    installs: 1980,
    rating: 4.7,
    createdAt: "2026-10-07",
  },
  {
    id: "automated-data-insights",
    title: "Automated Data Insights",
    version: "3.0.0",
    price: "$29",
    isFree: false,
    isFeatured: true,
    description: "Processes complex CSV, JSON, and SQL tables to generate automated visual dashboards, outlier detection, and executive summaries.",
    installPrompt: "npx create-agent-skill automated-data-insights",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-codex.png",
      "/figma/agent-gemini.png",
    ],
    roles: ["researcher", "consultant", "founder"],
    output: "slides",
    useCase: "client-reporting",
    category: "Analytics",
    installs: 3120,
    rating: 4.9,
    createdAt: "2026-10-06",
  },
  {
    id: "ecommerce-conversion-pro",
    title: "Ecommerce Conversion Pro",
    version: "1.4.0",
    price: "$15",
    isFree: false,
    isFeatured: false,
    description: "Analyzes buyer drop-offs, writes persuasive checkout microcopy, and generates tailored product descriptions that boost conversions.",
    installPrompt: "npx create-agent-skill ecommerce-conversion-pro",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-cursor.png",
    ],
    roles: ["ecommerce", "marketer"],
    output: "web",
    useCase: "ecommerce-conversion",
    category: "Ecommerce",
    installs: 1450,
    rating: 4.6,
    createdAt: "2026-10-05",
  },
  {
    id: "interactive-pitch-deck",
    title: "Interactive Pitch Deck",
    version: "2.0.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Generates visually compelling investor pitch presentations with built-in financial models and competitive landscape diagrams.",
    installPrompt: "npx create-agent-skill interactive-pitch-deck",
    previewImage: "/figma/node_751_5606.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-cursor.png",
    ],
    roles: ["founder", "consultant"],
    output: "slides",
    useCase: "sales-fundraising",
    category: "Business",
    installs: 2610,
    rating: 4.8,
    createdAt: "2026-10-04",
  },
  {
    id: "educational-explainer-generator",
    title: "Education Explainer AI",
    version: "1.1.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Breaks down advanced scientific and technical concepts into engaging, digestible lesson plans with quizzes and illustrative cards.",
    installPrompt: "npx create-agent-skill education-explainer-ai",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-gemini.png",
      "/figma/agent-codex.png",
    ],
    roles: ["teacher", "researcher"],
    output: "slides",
    useCase: "education",
    category: "Education",
    installs: 1890,
    rating: 4.9,
    createdAt: "2026-10-03",
  },
  {
    id: "creative-previs-director",
    title: "Creative Previs Studio",
    version: "3.2.0",
    price: "$35",
    isFree: false,
    isFeatured: true,
    description: "Produces storyboard frames, camera blocking guides, and lighting look-dev renders for film, commercial, and game cinematic pipelines.",
    installPrompt: "npx create-agent-skill creative-previs-studio",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-cursor.png",
    ],
    roles: ["designer", "content-creator"],
    output: "image",
    useCase: "creative-previsualization",
    category: "Creative",
    installs: 2130,
    rating: 4.9,
    createdAt: "2026-10-02",
  },
  {
    id: "research-paper-synthesizer",
    title: "Research Paper Synthesizer",
    version: "1.8.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Digests multi-page ArXiv and PubMed papers into concise methodological comparisons, key findings, and reproducible citations.",
    installPrompt: "npx create-agent-skill research-paper-synthesizer",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-gemini.png",
      "/figma/agent-codex.png",
    ],
    roles: ["researcher", "teacher"],
    output: "web",
    useCase: "research-communication",
    category: "Research",
    installs: 3410,
    rating: 4.8,
    createdAt: "2026-10-01",
  },
  {
    id: "content-publishing-pipeline",
    title: "Content Publishing Engine",
    version: "2.3.0",
    price: "$19",
    isFree: false,
    isFeatured: true,
    description: "Automates article outlining, SEO metadata generation, headline testing, and multi-format markdown syndication across your blog.",
    installPrompt: "npx create-agent-skill content-publishing-engine",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-cursor.png",
    ],
    roles: ["content-creator", "marketer"],
    output: "web",
    useCase: "publishing",
    category: "Writing",
    installs: 2540,
    rating: 4.7,
    createdAt: "2026-09-30",
  },
  {
    id: "python-api-scaffolder",
    title: "FastAPI Microservice Scaffolder",
    version: "1.5.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Builds production-ready asynchronous Python FastAPI endpoints with Pydantic v2 validation, Dockerfile, and pytest coverage.",
    installPrompt: "npx create-agent-skill fastapi-scaffolder",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["swe"],
    output: "web",
    useCase: "product-launch",
    category: "Engineering",
    installs: 4120,
    rating: 4.9,
    createdAt: "2026-09-28",
  },
  {
    id: "primary-doodle-deck",
    title: "Primary Doodle Deck",
    version: "1.2.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Hand-drawn expressive slide deck templates, custom vector annotations, and animated visual diagrams for product storytelling.",
    installPrompt: "npx create-agent-skill primary-doodle-deck",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["founder", "designer", "content-creator"],
    output: "slides",
    useCase: "sales-fundraising",
    category: "Presentations",
    installs: 42,
    rating: 4.9,
    createdAt: "2026-10-12",
  },
  {
    id: "citrus-loop-deck",
    title: "Citrus Loop Deck",
    version: "2.0.1",
    price: "$12",
    isFree: false,
    isFeatured: true,
    description: "Vibrant high-contrast keynote presentations featuring kinetic typography, metric callouts, and multi-device product mockups.",
    installPrompt: "npx create-agent-skill citrus-loop-deck",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-codex.png",
    ],
    roles: ["marketer", "content-creator"],
    output: "slides",
    useCase: "product-launch",
    category: "Presentations",
    installs: 41,
    rating: 4.8,
    createdAt: "2026-10-11",
  },
  {
    id: "sorbet-window-deck",
    title: "Sorbet Window Deck",
    version: "1.0.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Pastel editorial layouts designed for brand books, design portfolios, and client proposals with strict typographic hierarchy.",
    installPrompt: "npx create-agent-skill sorbet-window-deck",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["designer", "content-creator"],
    output: "slides",
    useCase: "brand-identity",
    category: "Presentations",
    installs: 39,
    rating: 4.9,
    createdAt: "2026-10-10",
  },
  {
    id: "chromatic-futures-deck",
    title: "Chromatic Futures Deck",
    version: "3.1.0",
    price: "$15",
    isFree: false,
    isFeatured: true,
    description: "Dark-mode futuristic architecture and deep tech slides with glowing cyber gradients and animated data telemetry charts.",
    installPrompt: "npx create-agent-skill chromatic-futures-deck",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["swe", "designer", "founder"],
    output: "slides",
    useCase: "web-design",
    category: "Presentations",
    installs: 40,
    rating: 5.0,
    createdAt: "2026-10-09",
  },
  {
    id: "meta-style-og-image",
    title: "Meta Style OG Image",
    version: "1.1.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Dynamic Open Graph and social share cards engineered with high-contrast type and auto-centering for Facebook, Threads, and Instagram.",
    installPrompt: "npx create-agent-skill meta-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["content-creator", "marketer"],
    output: "image",
    useCase: "social-media",
    category: "Design",
    installs: 43,
    rating: 4.9,
    createdAt: "2026-10-08",
  },
  {
    id: "airbnb-style-og-image",
    title: "Airbnb Style OG Image",
    version: "1.0.4",
    price: "$9",
    isFree: false,
    isFeatured: false,
    description: "Editorial photography layout frames, subtle warm scrim gradients, and crisp metadata pills inspired by modern hospitality apps.",
    installPrompt: "npx create-agent-skill airbnb-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-kimi.png",
      "/figma/agent-codex.png",
    ],
    roles: ["designer", "marketer"],
    output: "image",
    useCase: "brand-identity",
    category: "Design",
    installs: 42,
    rating: 4.8,
    createdAt: "2026-10-07",
  },
  {
    id: "nike-style-og-image",
    title: "Nike Style OG Image",
    version: "2.0.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "High-impact athletic imagery, ultra-condensed typography, and bold contrast overlays engineered for high-engagement product launches.",
    installPrompt: "npx create-agent-skill nike-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["designer", "founder"],
    output: "image",
    useCase: "product-launch",
    category: "Design",
    installs: 40,
    rating: 4.9,
    createdAt: "2026-10-06",
  },
  {
    id: "shopify-style-og-image",
    title: "Shopify Style OG Image",
    version: "1.3.0",
    price: "$10",
    isFree: false,
    isFeatured: false,
    description: "Clean commerce product cards with price badges, stock tags, and currency formatting for merchant catalogs.",
    installPrompt: "npx create-agent-skill shopify-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["ecommerce-seller", "founder"],
    output: "image",
    useCase: "product-launch",
    category: "Design",
    installs: 40,
    rating: 4.7,
    createdAt: "2026-10-05",
  },
  {
    id: "apple-style-og-image",
    title: "Apple Style OG Image",
    version: "2.1.0",
    price: "Free",
    isFree: true,
    isFeatured: true,
    description: "Minimalist titanium metallic gradient surfaces, San Francisco typography balancing, and glassmorphic device highlights.",
    installPrompt: "npx create-agent-skill apple-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["designer", "marketer"],
    output: "image",
    useCase: "brand-identity",
    category: "Design",
    installs: 49,
    rating: 5.0,
    createdAt: "2026-10-04",
  },
  {
    id: "discord-style-og-image",
    title: "Discord Style OG Image",
    version: "1.0.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Playful dark-mode community banner cards with chat bubble accents, online status dots, and developer badge integration.",
    installPrompt: "npx create-agent-skill discord-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["swe", "founder"],
    output: "image",
    useCase: "social-media",
    category: "Design",
    installs: 39,
    rating: 4.8,
    createdAt: "2026-10-03",
  },
  {
    id: "slack-style-og-image",
    title: "Slack Style OG Image",
    version: "1.2.0",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Enterprise collaboration announcement cards featuring channel hashtags, reaction emojis, and threaded card snippets.",
    installPrompt: "npx create-agent-skill slack-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["founder", "consultant"],
    output: "image",
    useCase: "publishing",
    category: "Design",
    installs: 40,
    rating: 4.8,
    createdAt: "2026-10-02",
  },
  {
    id: "duolingo-style-og-image",
    title: "Duolingo Style OG Image",
    version: "1.0.2",
    price: "Free",
    isFree: true,
    isFeatured: false,
    description: "Gamified streak banners, energetic badge illustrations, and progress milestone cards optimized for social brag sharing.",
    installPrompt: "npx create-agent-skill duolingo-style-og-image",
    previewImage: "/figma/marketplace_sample_card.png",
    models: [
      "/figma/agent-claude.png",
      "/figma/agent-antigravity.png",
      "/figma/agent-cursor.png",
      "/figma/agent-codex.png",
    ],
    roles: ["teacher", "marketer"],
    output: "image",
    useCase: "education",
    category: "Design",
    installs: 40,
    rating: 4.9,
    createdAt: "2026-10-01",
  },
];


export type GridItem =
  | ({ type: "skill" } & SkillItem)
  | {
      type: "ad";
      id: string;
      sponsorName: string;
      title: string;
      description: string;
      badgeLabel: string;
      ctaText: string;
      ctaUrl: string;
      imageSrc?: string;
    };

export const MARKETPLACE_ADS: Array<Omit<Extract<GridItem, { type: "ad" }>, "type">> = [
  {
    id: "ad-claude-fleet",
    sponsorName: "Claude Fleet",
    title: "Scale Autonomous Agent Fleets",
    description: "Deploy, orchestrate and evaluate multi-agent reasoning loops in production with enterprise guardrails.",
    badgeLabel: "Sponsored",
    ctaText: "Explore Fleet",
    ctaUrl: "https://claude.ai",
  },
  {
    id: "ad-creator-monetize",
    sponsorName: "Skillhouse Pro",
    title: "Monetize Custom Agent Skills",
    description: "Publish verified SKILL.md packages to 50,000+ developers and earn 85% revenue share on every install.",
    badgeLabel: "Creator Network",
    ctaText: "Start Earning",
    ctaUrl: "https://skillhouse.ai",
  },
];

export interface MarketplaceViewProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigateHome?: () => void;
  onNavigateMySkills?: () => void;
  onOpenCommandPalette?: () => void;
  savedSkillsCount?: number;
  onSelectSkillDetail?: (skillId: string) => void;
  className?: string;
  isLoading?: boolean;
  isSignedIn?: boolean;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
    provider?: "google" | "github";
  } | null;
  onOpenLoginModal?: () => void;
  onSignOut?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenHelpCenter?: () => void;
}


export function resolveCategoryToFilters(categoryName?: string, tab?: string): FilterState {
  const norm = (categoryName || "").toLowerCase().trim().replace(/[\r\n]+/g, " ");
  const defaultState: FilterState = {
    recommendations: ["all"],
    outputs: [],
    roles: [],
    useCases: [],
  };

  if (!norm || norm === "all" || norm === "see all" || norm === "skills") {
    return defaultState;
  }

  // 1. Curated / Recommendations
  if (norm.includes("free")) {
    return { ...defaultState, recommendations: ["free"] };
  }
  if (norm.includes("featured") || norm.includes("trending") || norm.includes("top-rated") || norm.includes("top rated")) {
    return { ...defaultState, recommendations: ["featured"] };
  }

  // 2. Tab-specific resolution if tab is provided
  if (tab === "output") {
    if (norm.includes("image")) return { recommendations: [], outputs: ["image"], roles: [], useCases: [] };
    if (norm.includes("slide") || norm.includes("presentation")) return { recommendations: [], outputs: ["slides"], roles: [], useCases: [] };
    if (norm.includes("video")) return { recommendations: [], outputs: ["video"], roles: [], useCases: [] };
    if (norm.includes("web") || norm.includes("html")) return { recommendations: [], outputs: ["web"], roles: [], useCases: [] };
  }

  if (tab === "role") {
    if (norm.includes("content creator") || norm === "content-creator") return { recommendations: [], outputs: [], roles: ["content-creator"], useCases: [] };
    if (norm.includes("commerce") || norm === "ecommerce") return { recommendations: [], outputs: [], roles: ["ecommerce"], useCases: [] };
    if (norm.includes("consultant")) return { recommendations: [], outputs: [], roles: ["consultant"], useCases: [] };
    if (norm.includes("marketer")) return { recommendations: [], outputs: [], roles: ["marketer"], useCases: [] };
    if (norm.includes("software") || norm.includes("engineer") || norm === "swe") return { recommendations: [], outputs: [], roles: ["swe"], useCases: [] };
    if (norm.includes("founder")) return { recommendations: [], outputs: [], roles: ["founder"], useCases: [] };
    if (norm.includes("designer")) return { recommendations: [], outputs: [], roles: ["designer"], useCases: [] };
    if (norm.includes("teacher")) return { recommendations: [], outputs: [], roles: ["teacher"], useCases: [] };
    if (norm.includes("researcher")) return { recommendations: [], outputs: [], roles: ["researcher"], useCases: [] };
  }

  if (tab === "use-case") {
    if (norm.includes("web design") || norm === "web-design") return { recommendations: [], outputs: [], roles: [], useCases: ["web-design"] };
    if (norm.includes("brand") || norm.includes("identity") || norm === "brand-identity") return { recommendations: [], outputs: [], roles: [], useCases: ["brand-identity"] };
    if (norm.includes("social") || norm === "social-media") return { recommendations: [], outputs: [], roles: [], useCases: ["social-media"] };
    if (norm.includes("education") || norm.includes("explainer") || norm === "education") return { recommendations: [], outputs: [], roles: [], useCases: ["education"] };
    if (norm.includes("product launch") || norm === "product-launch") return { recommendations: [], outputs: [], roles: [], useCases: ["product-launch"] };
    if (norm.includes("reporting") || norm.includes("client reporting") || norm === "client-reporting") return { recommendations: [], outputs: [], roles: [], useCases: ["client-reporting"] };
    if (norm.includes("research communication") || norm === "research-communication") return { recommendations: [], outputs: [], roles: [], useCases: ["research-communication"] };
    if (norm.includes("publishing") || norm.includes("content publishing") || norm === "publishing") return { recommendations: [], outputs: [], roles: [], useCases: ["publishing"] };
  }

  // 3. Direct Outputs matching
  if (norm === "image" || norm === "images" || norm.includes("image")) {
    return { recommendations: [], outputs: ["image"], roles: [], useCases: [] };
  }
  if (norm === "slides" || norm === "presentations" || norm.includes("presentation") || norm.includes("slide")) {
    return { recommendations: [], outputs: ["slides"], roles: [], useCases: [] };
  }
  if (norm === "video" || norm.includes("video")) {
    return { recommendations: [], outputs: ["video"], roles: [], useCases: [] };
  }
  if (norm === "web" || norm === "web & html" || norm === "web-html" || norm === "html" || norm.includes("html")) {
    return { recommendations: [], outputs: ["web"], roles: [], useCases: [] };
  }

  // 4. Direct Roles matching
  if (norm.includes("content creator") || norm === "content-creator") {
    return { recommendations: [], outputs: [], roles: ["content-creator"], useCases: [] };
  }
  if (norm.includes("commerce") || norm === "ecommerce") {
    return { recommendations: [], outputs: [], roles: ["ecommerce"], useCases: [] };
  }
  if (norm.includes("consultant")) {
    return { recommendations: [], outputs: [], roles: ["consultant"], useCases: [] };
  }
  if (norm.includes("marketer")) {
    return { recommendations: [], outputs: [], roles: ["marketer"], useCases: [] };
  }
  if (norm.includes("software") || norm.includes("engineer") || norm === "swe") {
    return { recommendations: [], outputs: [], roles: ["swe"], useCases: [] };
  }
  if (norm.includes("founder")) {
    return { recommendations: [], outputs: [], roles: ["founder"], useCases: [] };
  }
  if (norm.includes("designer")) {
    return { recommendations: [], outputs: [], roles: ["designer"], useCases: [] };
  }
  if (norm.includes("teacher")) {
    return { recommendations: [], outputs: [], roles: ["teacher"], useCases: [] };
  }
  if (norm.includes("researcher")) {
    return { recommendations: [], outputs: [], roles: ["researcher"], useCases: [] };
  }

  // 5. Direct Use Cases matching
  if (norm.includes("web design") || norm === "web-design") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["web-design"] };
  }
  if (norm.includes("brand") || norm.includes("identity") || norm === "brand-identity") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["brand-identity"] };
  }
  if (norm.includes("social") || norm === "social-media") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["social-media"] };
  }
  if (norm.includes("education") || norm.includes("explainer") || norm === "education") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["education"] };
  }
  if (norm.includes("product launch") || norm === "product-launch") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["product-launch"] };
  }
  if (norm.includes("reporting") || norm.includes("client reporting") || norm === "client-reporting") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["client-reporting"] };
  }
  if (norm.includes("research communication") || norm === "research-communication") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["research-communication"] };
  }
  if (norm.includes("publishing") || norm.includes("content publishing") || norm === "publishing") {
    return { recommendations: [], outputs: [], roles: [], useCases: ["publishing"] };
  }
  if (norm.includes("previsualization") || norm.includes("previs")) {
    return { recommendations: [], outputs: [], roles: [], useCases: ["creative-previsualization"] };
  }
  if (norm.includes("fundraising") || norm.includes("sales")) {
    return { recommendations: [], outputs: [], roles: [], useCases: ["sales-fundraising"] };
  }

  // 6. Home screen grid cards fallbacks
  if (norm === "output" || norm.includes("skills by output") || norm.includes("output")) {
    return { recommendations: [], outputs: ["web", "slides", "video", "image"], roles: [], useCases: [] };
  }
  if (norm === "roles" || norm === "role" || norm.includes("skills by roles") || norm.includes("role")) {
    return { recommendations: [], outputs: [], roles: ["content-creator", "founder", "designer", "swe", "marketer"], useCases: [] };
  }
  if (norm === "use-case" || norm.includes("skills by use-case") || norm.includes("use case")) {
    return { recommendations: [], outputs: [], roles: [], useCases: ["web-design", "brand-identity", "product-launch", "social-media", "education", "publishing", "client-reporting"] };
  }

  return defaultState;
}

export function MarketplaceView({
  initialCategory,
  initialSearch,
  onNavigateHome,
  onNavigateMySkills,
  onOpenCommandPalette,
  savedSkillsCount,
  onSelectSkillDetail,
  className = "",
  isLoading: propIsLoading,
  isSignedIn: propIsSignedIn,
  user,
  onOpenLoginModal: propOnOpenLoginModal,
  onSignOut: propOnSignOut,
  onOpenProfile,
  onOpenSettings,
  onOpenHelpCenter,
}: MarketplaceViewProps) {
  const router = useRouter();

  const [skills] = useState<SkillItem[]>(MARKETPLACE_SKILLS);
  const [bookmarkedSkills, setBookmarkedSkills] = useState<Record<string, boolean>>({});
  const [searchValue, setSearchValue] = useState(initialSearch || "");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "alphabetical">("newest");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  useScrollLock(mobileFiltersVisible);


  const auth = useAuthSafe();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [internalIsSignedIn, setInternalIsSignedIn] = useState(false);
  const effectiveIsSignedIn = propIsSignedIn !== undefined ? propIsSignedIn : (auth ? auth.isSignedIn : internalIsSignedIn);
  const effectiveUser = user !== undefined ? user : (auth?.user || null);
  const [isRequestSkillOpen, setIsRequestSkillOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);

  const isTestEnv = typeof process !== "undefined" && process.env.NODE_ENV === "test";

  // Check if ?loading=true is in the URL to keep skeleton on-screen indefinitely for inspection
  const isUrlLoading = typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("loading") === "true" || new URLSearchParams(window.location.search).get("loading") === "1");

  // Initial loading state: displays greyscale skeleton cards during initial catalogue load
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    if (propIsLoading !== undefined) return propIsLoading;
    if (isUrlLoading) return true;
    return !isTestEnv;
  });

  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    if (isTestEnv || propIsLoading !== undefined || isUrlLoading) return;
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [propIsLoading, isTestEnv, isUrlLoading]);

  const effectiveLoading = isFilterLoading || (propIsLoading !== undefined ? propIsLoading : (isInitialLoading || isUrlLoading));

  const handleSimulateLoading = () => {
    setIsFilterLoading(true);
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 1500);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    if (!isTestEnv) {
      setIsFilterLoading(true);
      setTimeout(() => setIsFilterLoading(false), 450);
    }
    setFilters(newFilters);
  };

  // Infinite Scroll Pagination
  const PAGE_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Initialize filters based on optional initialCategory
  const [filters, setFilters] = useState<FilterState>(() => {
    return initialCategory ? resolveCategoryToFilters(initialCategory) : {
      recommendations: ["all"],
      outputs: [],
      roles: [],
      useCases: [],
    };
  });

  // Keep filters synchronized if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setFilters(resolveCategoryToFilters(initialCategory));
    }
  }, [initialCategory]);

  // Reset pagination when filters, search, or sort change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [filters, searchValue, sortBy]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchValue(initialSearch);
    }
  }, [initialSearch]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortDropdownOpen]);

  const handleToggleBookmark = (skillId: string, isBookmarked: boolean) => {
    setBookmarkedSkills((prev) => ({
      ...prev,
      [skillId]: isBookmarked,
    }));
  };

  const handleSelectCategoryFromNav = (cat: string, tab?: string) => {
    if (!isTestEnv) {
      setIsFilterLoading(true);
      setTimeout(() => setIsFilterLoading(false), 450);
    }
    setFilters(resolveCategoryToFilters(cat, tab));
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("view", "marketplace");
      params.set("category", cat);
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  const filteredSkills = useMemo(() => {
    const result = skills.filter((skill) => {
      // 1. Text Search query
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          skill.title.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q) ||
          skill.output.toLowerCase().includes(q) ||
          skill.useCase.toLowerCase().includes(q) ||
          skill.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Recommendations filter
      if (filters.recommendations.includes("free") && !skill.isFree) {
        return false;
      }
      if (filters.recommendations.includes("featured") && !skill.isFeatured) {
        return false;
      }

      // 3. Outputs filter
      if (filters.outputs.length > 0) {
        const matchesOutput = filters.outputs.some((o) => skill.output.toLowerCase() === o);
        if (!matchesOutput) return false;
      }

      // 4. Roles filter
      if (filters.roles.length > 0) {
        const matchesRole = filters.roles.some((r) =>
          skill.roles.some((sr) => sr === r || sr.includes(r) || r.includes(sr))
        );
        if (!matchesRole) return false;
      }

      // 5. Use Cases filter
      if (filters.useCases.length > 0) {
        const matchesUseCase = filters.useCases.some(
          (u) => skill.useCase.toLowerCase() === u || skill.useCase.toLowerCase().includes(u)
        );
        if (!matchesUseCase) return false;
      }

      return true;
    });

    // Sort order
    if (sortBy === "popular") {
      result.sort((a, b) => (b.installs || 0) - (a.installs || 0));
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // newest
      result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }

    return result;
  }, [skills, searchValue, filters, sortBy]);



  const totalActiveFilters = useMemo(() => {
    return (
      filters.recommendations.filter((r) => r !== "all").length +
      filters.outputs.length +
      filters.roles.length +
      filters.useCases.length
    );
  }, [filters]);

  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = [];
    let adIndex = 0;

    filteredSkills.forEach((skill, index) => {
      // Strategic insert 1: After first row of 4 skills (position 5)
      if (index === 4 && adIndex < MARKETPLACE_ADS.length) {
        items.push({ type: "ad", ...MARKETPLACE_ADS[adIndex++] });
      }
      // Strategic insert 2: After second block of skills (position 10)
      if (index === 8 && adIndex < MARKETPLACE_ADS.length) {
        items.push({ type: "ad", ...MARKETPLACE_ADS[adIndex++] });
      }

      items.push({ type: "skill", ...skill });
    });

    return items;
  }, [filteredSkills]);

  const hasMore = visibleCount < gridItems.length;

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, gridItems.length));
            setIsLoadingMore(false);
          }, 650);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, gridItems.length]);

  const handleManualLoadMore = () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, gridItems.length));
      setIsLoadingMore(false);
    }, 600);
  };

  const displayedGridItems = gridItems.slice(0, visibleCount);

  const handleResetFilters = () => {
        setFilters({
      recommendations: ["all"],
      outputs: [],
      roles: [],
      useCases: [],
    });
    setSearchValue("");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("view", "marketplace");
      params.delete("category");
      params.delete("search");
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`} data-testid="skills-marketplace-page">
      {/* 1. Sticky Navigation Bar */}
      <NavBar
        currentView="marketplace"
        onViewChange={(view) => {
          if (view === "design-system") {
            router.push("/design-system");
          } else if (view === "home") {
            if (onNavigateHome) {
              onNavigateHome();
            } else {
              router.push("/");
            }
          } else if (view === "my-skills") {
            if (onNavigateMySkills) {
              onNavigateMySkills();
            } else {
              router.push("/?view=my-skills");
            }
          } else if (view === "marketplace") {
            handleResetFilters();
          }
        }}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={(val) => setSearchValue(val)}
        onOpenCommandPalette={onOpenCommandPalette}
        savedSkillsCount={savedSkillsCount}
        onSelectCategory={handleSelectCategoryFromNav}
        onRequestSkill={() => setIsRequestSkillOpen(true)}
        isSignedIn={effectiveIsSignedIn}
        user={effectiveUser || undefined}
        onOpenLoginModal={() => {
          if (propOnOpenLoginModal) propOnOpenLoginModal();
          else if (auth) auth.openLogin();
          else setIsLoginModalOpen(true);
        }}
        onGetStarted={() => {
          if (propOnOpenLoginModal) propOnOpenLoginModal();
          else if (auth) auth.openLogin();
          else setIsLoginModalOpen(true);
        }}
        onSignOut={() => {
          if (propOnSignOut) propOnSignOut();
          else if (auth) auth.logout();
          else setInternalIsSignedIn(false);
        }}
        onOpenProfile={onOpenProfile || (auth ? () => auth.openProfile("profile") : undefined)}
        onOpenSettings={onOpenSettings || (auth ? () => auth.openProfile("cli") : undefined)}
        onOpenHelpCenter={onOpenHelpCenter || (auth ? auth.openHelpCenter : undefined)}
      />

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`${styles.mobileFilterOverlay} ${mobileFiltersVisible ? styles.mobileOpen : ""}`}
        onClick={() => setMobileFiltersVisible(false)}
        aria-hidden="true"
      />

      {/* 2. Main Marketplace Layout Container - Exact Figma Node 751:4572 Specs */}
      <div className={styles.marketplaceLayout}>
        {/* Left Filter Sidebar Column - Exact Figma 751:4573 (w: 220px, pad: 24px, gap: 24px) */}
        <div
          id="marketplace-sidebar"
          className={`${styles.sidebarColumn} ${isSidebarCollapsed ? styles.collapsed : ""} ${mobileFiltersVisible ? styles.mobileOpen : ""}`}
          aria-hidden={isSidebarCollapsed}
          inert={isSidebarCollapsed || undefined}
        >
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onToggleCollapse={() => setIsSidebarCollapsed(true)}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
        {/* Right Main Content Area - Exact Figma 751:4736 (w: 1140px, pad-left: 40px, pad-right: 40px, pad-top: 24px) */}
        <main className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>

          {/* Main Title & Subtitle Frame - Exact Figma 751:4737 (h: 64px, gap: 12px) */}
          <div className={styles.mainHeader}>
            <h1 className={styles.title}>Agent Skills Marketplace</h1>
            <p className={styles.subtitle}>
              Works in Claude Code, Codex, Cursor, Antigravity and any agent that reads SKILL.md.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className={styles.mobileFilterBar}>
            <button
              type="button"
              className={styles.filterToggleBtn}
              onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
              aria-label="Toggle filter options"
            >
              <FilterIcon size={14} />
              <span>{mobileFiltersVisible ? "Close Filters" : "Filter Skills"}</span>
            </button>
            <span className={styles.skillsCount}>
              {filteredSkills.length} Skills
            </span>
          </div>

          {/* Controls Bar */}
          <div className={styles.controlsBar}>
            {/* Left Controls: Skills Count */}
            <div className={styles.controlsLeft}>
              <span className={styles.skillsCount} data-testid="skills-count">
                {filteredSkills.length} Skills
              </span>
            </div>

            {/* Right Controls: Sort Select Dropdown + Expand Filters Button (skillry.dev pattern) */}
            <div className={styles.controlsRight}>
              <div ref={sortRef} className={styles.sortWrapper}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                aria-expanded={sortDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Sort skills by order"
              >
                <span>
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "popular"
                    ? "Most popular"
                    : "Alphabetical"}
                </span>
                <span className={`${styles.sortChevron} ${sortDropdownOpen ? styles.open : ""}`} aria-hidden="true">
                  <ChevronDown size={14} />
                </span>
              </button>

              {sortDropdownOpen && (
                <div className={styles.sortDropdownMenu} role="listbox">
                  <button
                    type="button"
                    role="option"
                    aria-selected={sortBy === "newest"}
                    className={`${styles.sortOption} ${sortBy === "newest" ? styles.selected : ""}`}
                    onClick={() => {
                      setSortBy("newest");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Newest
                  </button>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sortBy === "popular"}
                    className={`${styles.sortOption} ${sortBy === "popular" ? styles.selected : ""}`}
                    onClick={() => {
                      setSortBy("popular");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Most popular
                  </button>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sortBy === "alphabetical"}
                    className={`${styles.sortOption} ${sortBy === "alphabetical" ? styles.selected : ""}`}
                    onClick={() => {
                      setSortBy("alphabetical");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Alphabetical
                  </button>
                </div>
              )}
              </div>

              <button
                type="button"
                className={styles.simulateLoadingBtn}
                onClick={handleSimulateLoading}
                title="Preview greyscale skeleton loading state"
                aria-label="Simulate loading state"
                data-testid="simulate-loading-btn"
              >
                <RefreshCw size={13} className={effectiveLoading ? styles.spinning : ""} aria-hidden="true" />
                <span>Simulate loading</span>
              </button>

              {isSidebarCollapsed && (
                <button
                  type="button"
                  className={styles.expandFiltersBtn}
                  onClick={() => setIsSidebarCollapsed(false)}
                  data-testid="toggle-filter-sidebar"
                  aria-label={`Show filters${totalActiveFilters > 0 ? ` (${totalActiveFilters} active)` : ""}`}
                  title="Show filters"
                >
                  <SlidersHorizontal size={14} className={styles.expandFiltersIcon} aria-hidden="true" />
                  <span>Filters</span>
                  {totalActiveFilters > 0 && (
                    <span className={styles.activeFilterBadge} data-testid="active-filter-badge">
                      {totalActiveFilters}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Skills Grid - Exact Figma 751:4748 (4 columns, col gap: 16px, row gap: 24px) */}
          {effectiveLoading ? (
            <div
              className={`${styles.skillsGrid} ${isSidebarCollapsed ? styles.expandedGrid : ""}`}
              id="marketplace-grid"
              data-testid="marketplace-grid"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkillCardSkeleton key={`skeleton-${i}`} gradientIndex={i} />
              ))}
            </div>
          ) : filteredSkills.length > 0 ? (
            <>
              <div
                className={`${styles.skillsGrid} ${isSidebarCollapsed ? styles.expandedGrid : ""}`}
                id="marketplace-grid"
                data-testid="marketplace-grid"
              >
                {displayedGridItems.map((item) =>
                  item.type === "ad" ? (
                    <AdCard
                      key={item.id}
                      id={item.id}
                      sponsorName={item.sponsorName}
                      title={item.title}
                      description={item.description}
                      badgeLabel={item.badgeLabel}
                      ctaText={item.ctaText}
                      ctaUrl={item.ctaUrl}
                      imageSrc={item.imageSrc}
                      onClick={() => {
                        if (item.ctaUrl) {
                          window.open(item.ctaUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                    />
                  ) : (
                    <SkillCard
                      key={item.id}
                      id={`skill-${item.id}`}
                      title={item.title}
                      category={item.category}
                      previewImage={item.previewImage}
                      models={item.models}
                      installs={item.installs}
                      isBookmarked={bookmarkedSkills[item.id]}
                      onBookmarkToggle={(isBookmarked) => handleToggleBookmark(item.id, isBookmarked)}
                      onClick={() => {
                        if (onSelectSkillDetail) {
                          onSelectSkillDetail(item.id);
                        } else {
                          router.push(`/skills/${item.id}`);
                        }
                      }}
                    />
                  )
                )}

                {/* Shimmering Skeleton Cards during Infinite Scroll Load */}
                {isLoadingMore && (
                  <>
                    <SkillCardSkeleton gradientIndex={0} />
                    <SkillCardSkeleton gradientIndex={1} />
                    <SkillCardSkeleton gradientIndex={2} />
                    <SkillCardSkeleton gradientIndex={3} />
                  </>
                )}
              </div>

              {/* Infinite Scroll Sentinel & Accessible Controls */}
              {hasMore && (
                <>
                  <div
                    ref={sentinelRef}
                    className={styles.infiniteScrollSentinel}
                    data-testid="infinite-scroll-sentinel"
                    aria-hidden="true"
                  />
                  <div className={styles.loadMoreContainer}>
                    <button
                      type="button"
                      className={styles.loadMoreButton}
                      onClick={handleManualLoadMore}
                      disabled={isLoadingMore}
                      data-testid="load-more-btn"
                    >
                      {isLoadingMore ? "Loading more skills..." : "Load more skills"}
                    </button>
                  </div>
                </>
              )}


            </>
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No skills found matching your filters</h3>
              <p className={styles.emptyDesc}>
                Try adjusting your search terms, clearing selected output or role tags, or explore our recommended skills.
              </p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleResetFilters}
              >
                Reset all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 4. Global Dark Footer */}
      <Footer
        onSelectCategory={(cat) => {
          handleSelectCategoryFromNav(cat);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateMarketplace={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Modals when rendered outside global AuthProvider */}
      {!auth && (
        <>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={() => {
              setInternalIsSignedIn(true);
              setIsLoginModalOpen(false);
            }}
          />

          <RequestSkillModal
            isOpen={isRequestSkillOpen}
            onClose={() => setIsRequestSkillOpen(false)}
            onSubmitSuccess={() => setIsRequestSkillOpen(false)}
          />
        </>
      )}
    </div>
  );
}
