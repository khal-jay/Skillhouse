"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/primitives/Breadcrumb";
import { NavBar } from "./NavBar";
import { SkillDetailHeader } from "./SkillDetailHeader";
import { SkillCard } from "./SkillCard";
import { Footer } from "./Footer";
import { AuthProvider, useAuthSafe } from "@/lib/AuthContext";
import styles from "./SkillDetailPage.module.css";

export interface SkillDetailData {
  id: string;
  title: string;
  version: string;
  price: string;
  isFree?: boolean;
  description: string;
  installPrompt: string;
  category: string;
  previewImage: string;
  thumbnails?: string[];
  models?: string[];
  roles?: string[];
}

export interface WorkflowStepMeta {
  step: string;
  title: string;
  tagline: string;
}

export const WORKFLOW_METADATA_BY_SKILL: Record<string, WorkflowStepMeta[]> = {
  "visual-canvas-deck": [
    {
      step: "01",
      title: "Brief Input",
      tagline: "Prompt to Spatial Outline",
    },
    {
      step: "02",
      title: "Canvas Composition",
      tagline: "Visual Layout Iteration",
    },
    {
      step: "03",
      title: "Export & Delivery",
      tagline: "Browser & PPTX Ready",
    },
  ],
  "pixel-promo-video": [
    {
      step: "01",
      title: "Design Import",
      tagline: "Extract Vector Assets",
    },
    {
      step: "02",
      title: "Motion Synthesis",
      tagline: "4K Keyframe Interpolation",
    },
    {
      step: "03",
      title: "Teaser Render",
      tagline: "Cinematic Video Export",
    },
  ],
};

export const DEFAULT_DETAIL_SKILL: SkillDetailData = {
  id: "visual-canvas-deck",
  title: "Visual Canvas Deck",
  version: "v1.0.1",
  price: "$19",
  isFree: false,
  description:
    "Create an exploratory presentation that turns a rough brief into editable spatial compositions and a coherent deck. It supports visual iteration through addressable canvases, clear outline approval, and a browser-ready presentation. Every deck can be edited in the browser and exported as an editable PowerPoint file.",
  installPrompt: "npx @skillhouse/cli install visual-canvas-deck",
  category: "Presentations",
  previewImage: "/figma/visual_canvas_deck_main.png",
  thumbnails: [
    "/figma/visual_canvas_deck_main.png",
    "/figma/visual_canvas_deck_slide2.png",
    "/figma/visual_canvas_deck_slide3.png",
  ],
  models: [
    "/figma/logo-1.png",
    "/figma/logo-2.png",
    "/figma/logo-3.png",
    "/figma/logo-4.png",
    "/figma/logo-5.png",
    "/figma/logo-6.png",
  ],
  roles: ["Product Manager", "Graphic Designer", "Art Director"],
};

export const SIMILAR_SKILLS = [
  {
    id: "pixel-promo-video",
    title: "Pixel Promo Video",
    category: "Video & Media",
    author: "MotionCraft",
    authorHandle: "@motioncraft",
    authorAvatar: "/figma/author-avatar.png",
    description: "Generate cinematic 4k product teaser animations directly from design files.",
    previewImage: "/figma/sim-1.png",
    rating: 4.9,
    stars: 5,
    reviewCount: 312,
    downloads: "2.4k",
    forks: "410",
    isBookmarked: false,
  },
  {
    id: "clean-syntax-theme",
    title: "Clean Syntax Theme",
    category: "Code & Dev",
    author: "SyntaxStudio",
    authorHandle: "@syntaxstudio",
    authorAvatar: "/figma/author-avatar.png",
    description: "Minimalist and accessible color tokens for high-contrast IDE coding.",
    previewImage: "/figma/sim-2.png",
    rating: 4.8,
    stars: 5,
    reviewCount: 184,
    downloads: "1.8k",
    forks: "230",
    isBookmarked: false,
  },
  {
    id: "isometric-icon-set",
    title: "Isometric Icon Set",
    category: "Design & Icons",
    author: "VectorGrid",
    authorHandle: "@vectorgrid",
    authorAvatar: "/figma/author-avatar.png",
    description: "Handcrafted 3D vector icons optimized for dark and light interfaces.",
    previewImage: "/figma/sim-3.png",
    rating: 4.95,
    stars: 5,
    reviewCount: 420,
    downloads: "3.2k",
    forks: "680",
    isBookmarked: false,
  },
  {
    id: "spatial-deck-pro",
    title: "Spatial Deck Pro",
    category: "Presentations",
    author: "DesignX",
    authorHandle: "@designx",
    authorAvatar: "/figma/author-avatar.png",
    description: "Next-gen keynote slides with embedded 3D scenes and reactive transitions.",
    previewImage: "/figma/sim-4.png",
    rating: 4.7,
    stars: 5,
    reviewCount: 156,
    downloads: "1.1k",
    forks: "140",
    isBookmarked: false,
  },
];

export interface SkillDetailPageProps {
  skill?: SkillDetailData;
  onBack?: () => void;
  onNavigateSkill?: (id: string) => void;
  onNavigateHome?: () => void;
  onNavigateMarketplace?: () => void;
  onOpenLoginModal?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenHelpCenter?: () => void;
  onSignOut?: () => void;
  className?: string;
  initialBookmarked?: boolean;
}

const SkillDetailPageInner: React.FC<SkillDetailPageProps> = ({
  skill = DEFAULT_DETAIL_SKILL,
  onBack,
  onNavigateSkill,
  onNavigateHome,
  onNavigateMarketplace,
  onOpenLoginModal: propOnOpenLoginModal,
  onOpenProfile: propOnOpenProfile,
  onOpenSettings: propOnOpenSettings,
  onOpenHelpCenter: propOnOpenHelpCenter,
  onSignOut: propOnSignOut,
  className = "",
}) => {
  const router = useRouter();
  const auth = useAuthSafe();
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [similarSkillsOffset, setSimilarSkillsOffset] = useState(0);

  const isSignedIn = auth?.isSignedIn ?? false;
  const user = auth?.user ?? null;

  const thumbnails = skill.thumbnails && skill.thumbnails.length > 0
    ? skill.thumbnails
    : [skill.previewImage];

  const activeImage = thumbnails[activeThumbnailIndex] || skill.previewImage;


  const visibleSimilarSkills = SIMILAR_SKILLS.slice(similarSkillsOffset, similarSkillsOffset + 4);

  const handlePrevSimilar = () => {
    setSimilarSkillsOffset((prev) => Math.max(0, prev - 1));
  };

  const handleNextSimilar = () => {
    setSimilarSkillsOffset((prev) => Math.min(SIMILAR_SKILLS.length - 4, prev + 1));
  };

  return (
    <div
      className={`${styles.pageContainer} ${className}`}
      data-testid="skill-detail-page"
    >
      {/* 1. Header Navigation Bar (Figma Node 751:5943) */}
      <NavBar
        currentView="marketplace"
        onViewChange={(view) => {
          if (view === "home") {
            if (onNavigateHome) onNavigateHome();
            else router.push("/");
          } else if (view === "marketplace") {
            if (onNavigateMarketplace) onNavigateMarketplace();
            else router.push("/skills");
          } else if (view === "my-skills") {
            router.push("/?view=my-skills");
          } else if (view === "design-system") {
            router.push("/design-system");
          }
        }}
        isSignedIn={isSignedIn}
        user={user || undefined}
        onOpenLoginModal={propOnOpenLoginModal || auth?.openLogin}
        onGetStarted={propOnOpenLoginModal || auth?.openLogin}
        onRequestSkill={isSignedIn ? auth?.openRequestSkill : auth?.openLogin}
        onOpenProfile={propOnOpenProfile || (() => auth?.openProfile("profile"))}
        onOpenSettings={propOnOpenSettings || (() => auth?.openProfile("cli"))}
        onOpenHelpCenter={propOnOpenHelpCenter || auth?.openHelpCenter}
        onSignOut={propOnSignOut || auth?.logout}
      />

      {/* Subheader Breadcrumbs Strip (Exact Figma Node 878:3503) */}
      <section className={styles.breadcrumbBar} aria-label="Breadcrumb navigation header">
        <div className={styles.breadcrumbBarInner}>
          <div className={styles.breadcrumbGroup}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => {
                if (onBack) onBack();
                else if (onNavigateMarketplace) onNavigateMarketplace();
                else router.back();
              }}
              aria-label="Back to skills marketplace"
              data-testid={onBack ? undefined : "skill-detail-back-btn"}
            >
              <ChevronLeft size={20} aria-hidden="true" />
              <span>Back</span>
            </button>

            <span className={styles.breadcrumbDivider} aria-hidden="true" />

            <Breadcrumb className={styles.breadcrumbNav} aria-label="Breadcrumb">
              <BreadcrumbList className={styles.breadcrumbTrail}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    onClick={(e) => {
                      if (onNavigateHome) {
                        e.preventDefault();
                        onNavigateHome();
                      }
                    }}
                  >
                    <Link href="/" aria-label="Home page">
                      <Home size={14} className={styles.breadcrumbHomeIcon} />
                      <span className={styles.breadcrumbHomeText}>Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={styles.breadcrumbChevron} />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    onClick={(e) => {
                      if (onNavigateMarketplace) {
                        e.preventDefault();
                        onNavigateMarketplace();
                      }
                    }}
                  >
                    <Link href="/skills">Skills</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={styles.breadcrumbChevron} />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    onClick={(e) => {
                      if (onNavigateMarketplace) {
                        e.preventDefault();
                        onNavigateMarketplace();
                      }
                    }}
                  >
                    <Link href={`/skills?category=${encodeURIComponent(skill.category)}`}>
                      {skill.category}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={styles.breadcrumbChevron} />
                <BreadcrumbItem>
                  <div className={styles.activeSkillPill}>
                    <BreadcrumbPage aria-current="page">{skill.title}</BreadcrumbPage>
                  </div>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* 2. Main Expansive 1400px Workspace with Sticky Gallery */}
      <main className={styles.mainContent}>
        {/* Two-Column Main Layout (Balanced Proportions) */}
        <section className={styles.twoColumnLayout}>
          {/* Left Column: Sticky Media Preview Gallery (Editorial Showcase) */}
          <div className={styles.galleryColumn}>
            <div className={styles.editorialFrameContainer}>
              {/* Bisecting Circular Navigation Left Arrow */}
              {thumbnails.length > 1 && (
                <button
                  type="button"
                  className={`${styles.bisectingArrow} ${styles.bisectingArrowLeft}`}
                  onClick={() =>
                    setActiveThumbnailIndex((prev) =>
                      prev === 0 ? thumbnails.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous preview slide"
                  title="Previous slide"
                  data-testid="editorial-prev-slide-btn"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
              )}

              {/* Bisecting Circular Navigation Right Arrow */}
              {thumbnails.length > 1 && (
                <button
                  type="button"
                  className={`${styles.bisectingArrow} ${styles.bisectingArrowRight}`}
                  onClick={() =>
                    setActiveThumbnailIndex((prev) =>
                      (prev + 1) % thumbnails.length
                    )
                  }
                  aria-label="Next preview slide"
                  title="Next slide"
                  data-testid="editorial-next-slide-btn"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              )}

              {/* Main Preview Canvas Frame with Inner Breathing Room */}
              <div
                className={styles.mainPreviewCanvas}
                data-testid="skill-detail-main-preview"
              >
                <Image
                  src={activeImage}
                  alt={`${skill.title} preview canvas`}
                  fill
                  sizes="(max-width: 992px) 100vw, 55vw"
                  className={styles.mainPreviewImage}
                  priority
                  unoptimized
                />
              </div>

              {/* Boxed Index Badge in Lower Right (Reference Style [ 01/03 ]) */}
              <div
                className={styles.boxedIndexBadge}
                aria-label={`Slide ${activeThumbnailIndex + 1} of ${thumbnails.length}`}
              >
                <span>{String(activeThumbnailIndex + 1).padStart(2, "0")}</span>
                <span className={styles.boxedIndexAccent}>
                  /{String(thumbnails.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Thumbnail Selectors Row */}
            <div
              className={styles.thumbnailsRow}
              role="tablist"
              aria-label="Preview gallery thumbnails"
            >
              {thumbnails.map((thumbSrc, idx) => (
                <button
                  key={`${thumbSrc}-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={activeThumbnailIndex === idx}
                  aria-label={`View preview slide ${idx + 1}`}
                  className={`${styles.thumbnailCard} ${
                    activeThumbnailIndex === idx ? styles.active : ""
                  }`}
                  onClick={() => setActiveThumbnailIndex(idx)}
                  data-testid={`thumbnail-tab-${idx}`}
                >
                  <Image
                    src={thumbSrc}
                    alt={`Thumbnail ${idx + 1}`}
                    width={104}
                    height={72}
                    className={styles.thumbnailImage}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Composite Action Panel */}
          <div className={styles.panelColumn}>
            <SkillDetailHeader
              title={skill.title}
              version={skill.version}
              price={skill.price}
              description={skill.description}
              installPrompt={skill.installPrompt}
              isFree={skill.isFree}
              variant={skill.isFree ? "free" : "premium"}
            />
          </div>
        </section>

        {/* 3. Similar Skills Section (Editorial Carousel with Bisecting Border Arrows) */}
        <section
          className={styles.similarSection}
          aria-labelledby="similar-skills-heading"
        >
          <div className={styles.similarHeaderRow}>
            <h2 id="similar-skills-heading" className={styles.similarTitle}>
              Similar Skills
            </h2>
            <div className={styles.similarCounterBadge}>
              <span>{String(similarSkillsOffset + 1).padStart(2, "0")}</span>
              <span className={styles.similarCounterAccent}>
                /{String(Math.max(1, SIMILAR_SKILLS.length - 3)).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className={styles.similarCarouselContainer}>
            {/* Bisecting Circular Navigation Left Arrow on Container Border */}
            <button
              type="button"
              className={`${styles.similarBisectingArrow} ${styles.similarBisectingArrowLeft}`}
              onClick={handlePrevSimilar}
              disabled={similarSkillsOffset === 0}
              aria-label="Previous similar skills"
              data-testid="similar-prev-btn"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>

            {/* Bisecting Circular Navigation Right Arrow on Container Border */}
            <button
              type="button"
              className={`${styles.similarBisectingArrow} ${styles.similarBisectingArrowRight}`}
              onClick={handleNextSimilar}
              disabled={similarSkillsOffset >= SIMILAR_SKILLS.length - 4}
              aria-label="Next similar skills"
              data-testid="similar-next-btn"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>

            <div
              className={styles.similarGrid}
              data-testid="similar-skills-grid"
            >
              {visibleSimilarSkills.map((simSkill) => (
                <SkillCard
                  key={simSkill.id}
                  id={simSkill.id}
                  title={simSkill.title}
                  category={simSkill.category}
                  previewImage={simSkill.previewImage}
                  isBookmarked={simSkill.isBookmarked}
                  onClick={() => {
                    if (onNavigateSkill) onNavigateSkill(simSkill.id);
                    else router.push(`/skills/${simSkill.id}`);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
};

export const SkillDetailPage: React.FC<SkillDetailPageProps> = (props) => {
  const auth = useAuthSafe();
  if (!auth) {
    return (
      <AuthProvider>
        <SkillDetailPageInner {...props} />
      </AuthProvider>
    );
  }
  return <SkillDetailPageInner {...props} />;
};
