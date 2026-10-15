"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavBar } from "./NavBar";
import { SkillDetailHeader } from "./SkillDetailHeader";
import { SkillCard } from "./SkillCard";
import { SkillDocViewer } from "./SkillDocViewer";
import { FaqSection } from "./FaqSection";
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
  previewImage: "/figma/visual_canvas_deck_slide1.png",
  thumbnails: [
    "/figma/visual_canvas_deck_slide1.png",
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
    previewImage: "/figma/pixel_promo_cover.jpg",
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
    previewImage: "/figma/clean_syntax_preview.jpg",
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
    previewImage: "/figma/isometric_icons_preview.jpg",
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
    previewImage: "/figma/spatial_deck_fitted.png",
    rating: 4.7,
    stars: 5,
    reviewCount: 156,
    downloads: "1.1k",
    forks: "140",
    isBookmarked: false,
  },
  {
    id: "prompt-architect",
    title: "Prompt Architect",
    category: "AI & ML",
    author: "DeepPrompt",
    authorHandle: "@deepprompt",
    authorAvatar: "/figma/author-avatar.png",
    description: "Systemic prompt optimization framework with automated regression validation.",
    previewImage: "/figma/node_751_5608.png",
    rating: 4.85,
    stars: 5,
    reviewCount: 94,
    downloads: "890",
    forks: "95",
    isBookmarked: false,
  },
  {
    id: "autonomous-agent-suite",
    title: "Autonomous Agent Suite",
    category: "Automation",
    author: "AgenticLabs",
    authorHandle: "@agenticlabs",
    authorAvatar: "/figma/author-avatar.png",
    description: "Multi-agent coordinator with deterministic planning and audit logging.",
    previewImage: "/figma/node_751_5609.png",
    rating: 4.9,
    stars: 5,
    reviewCount: 210,
    downloads: "1.5k",
    forks: "180",
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

  const thumbnails = (skill.thumbnails && skill.thumbnails.length > 0
    ? skill.thumbnails
    : [skill.previewImage]).filter(Boolean);

  const thumbnailsTrackRef = useRef<HTMLDivElement | null>(null);

  // Safe clamping when skill or thumbnails length changes
  if (activeThumbnailIndex >= thumbnails.length && thumbnails.length > 0) {
    setActiveThumbnailIndex(0);
  }

  const isSingleImage = thumbnails.length <= 1;
  const isCarousel = thumbnails.length >= 5;

  // Auto-scroll active thumbnail into view in carousel mode
  useEffect(() => {
    if (isCarousel && thumbnailsTrackRef.current) {
      const activeEl = thumbnailsTrackRef.current.children[activeThumbnailIndex] as HTMLElement;
      if (typeof activeEl?.scrollIntoView === "function") {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeThumbnailIndex, isCarousel]);

  const handleThumbnailsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveThumbnailIndex((prev) => (prev + 1) % thumbnails.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveThumbnailIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
    }
  };

  const handlePrevThumbSlide = () => {
    setActiveThumbnailIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const handleNextThumbSlide = () => {
    setActiveThumbnailIndex((prev) => (prev + 1) % thumbnails.length);
  };

  const activeImage = thumbnails[activeThumbnailIndex] || skill.previewImage;
  const isVideo =
    typeof activeImage === "string" &&
    (activeImage.endsWith(".mp4") ||
      activeImage.endsWith(".webm") ||
      activeImage.includes("/video"));

  const hasMoreSimilarSkills = SIMILAR_SKILLS.length > 4;
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

      {/* 2. Main Workspace (Figma Node 751:5602) */}
      <main className={styles.mainContent}>
        {/* Clean Editorial Breadcrumb Trail (Figma Node 751:5871) */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbRow}>
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
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Back to skills</span>
          </button>

          <span className={styles.divider} aria-hidden="true" />

          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link
                href="/"
                className={styles.breadcrumbLink}
                onClick={(e) => {
                  if (onNavigateHome) {
                    e.preventDefault();
                    onNavigateHome();
                  }
                }}
              >
                Home
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">/</li>
            <li className={styles.breadcrumbItem}>
              <Link
                href="/skills"
                className={styles.breadcrumbLink}
                onClick={(e) => {
                  if (onNavigateMarketplace) {
                    e.preventDefault();
                    onNavigateMarketplace();
                  }
                }}
              >
                Skills
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">/</li>
            <li className={styles.breadcrumbItem}>
              <Link
                href={`/skills?category=${encodeURIComponent(skill.category)}`}
                className={styles.breadcrumbLink}
                onClick={(e) => {
                  if (onNavigateMarketplace) {
                    e.preventDefault();
                    onNavigateMarketplace();
                  }
                }}
              >
                {skill.category}
              </Link>
            </li>
            <li className={styles.breadcrumbSeparator} aria-hidden="true">/</li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {skill.title}
              </span>
            </li>
          </ol>
        </nav>
        {/* Two-Column Main Layout (Balanced Proportions 437px + 24px + 437px) */}
        <section className={styles.twoColumnLayout}>
          {/* Left Column: Media Preview Gallery (Figma Node 4621:371214 / 751:5605) */}
          <div className={styles.galleryColumn}>
            {/* Accessible / test fallback slide navigation buttons */}
            {thumbnails.length > 1 && (
              <>
                <button
                  type="button"
                  className={styles.visuallyHidden}
                  onClick={() =>
                    setActiveThumbnailIndex(
                      (prev) => (prev + 1) % thumbnails.length
                    )
                  }
                  aria-label="Next preview slide"
                  data-testid="editorial-next-slide-btn"
                />
                <button
                  type="button"
                  className={styles.visuallyHidden}
                  onClick={() =>
                    setActiveThumbnailIndex(
                      (prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1)
                    )
                  }
                  aria-label="Previous preview slide"
                  data-testid="editorial-prev-slide-btn"
                />
              </>
            )}

            {/* Main Media Preview Canvas */}
              <div
                className={styles.mainPreviewCanvas}
              data-testid="skill-detail-main-preview"
            >
              {thumbnails.length > 1 && (
                <div
                  className={styles.visuallyHidden}
                  data-testid="gallery-stage-counter"
                  aria-live="polite"
                >
                  {String(activeThumbnailIndex + 1).padStart(2, "0")} / {String(thumbnails.length).padStart(2, "0")}
                </div>
              )}

              {isVideo ? (
                <video
                  src={activeImage}
                  className={styles.mainPreviewImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  data-testid="skill-detail-main-video"
                />
              ) : (
                <div className={styles.imageStageWrapper}>
                  <Image
                    src={activeImage}
                    alt={`${skill.title} preview slide ${activeThumbnailIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={styles.mainPreviewImage}
                    priority
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Selectors Row (Hidden if single image; Carousel if 5+; Responsive grid if 2-4) */}
            {!isSingleImage && (
              isCarousel ? (
                <div
                  className={styles.thumbnailsCarouselWrapper}
                  data-testid="thumbnails-carousel-wrapper"
                >
                  <button
                    type="button"
                    className={`${styles.carouselNavBtn} ${styles.carouselNavBtnPrev}`}
                    onClick={handlePrevThumbSlide}
                    aria-label="Previous preview thumbnail"
                    data-testid="thumb-carousel-prev-btn"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>

                  <div
                    ref={thumbnailsTrackRef}
                    className={styles.thumbnailsScrollTrack}
                    role="tablist"
                    aria-label="Preview gallery thumbnails"
                    onKeyDown={handleThumbnailsKeyDown}
                    tabIndex={0}
                    data-testid="thumbnails-scroll-track"
                  >
                    {thumbnails.map((thumbSrc, idx) => (
                      <button
                        key={idx}
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
                        <div className={styles.thumbImageWrapper}>
                          <Image
                            src={thumbSrc}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            sizes="160px"
                            className={styles.thumbnailImg}
                            unoptimized
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`${styles.carouselNavBtn} ${styles.carouselNavBtnNext}`}
                    onClick={handleNextThumbSlide}
                    aria-label="Next preview thumbnail"
                    data-testid="thumb-carousel-next-btn"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div
                  className={styles.thumbnailsRow}
                  role="tablist"
                  aria-label="Preview gallery thumbnails"
                  onKeyDown={handleThumbnailsKeyDown}
                  tabIndex={0}
                  style={{ gridTemplateColumns: `repeat(${thumbnails.length}, 1fr)` }}
                >
                  {thumbnails.map((thumbSrc, idx) => (
                    <button
                      key={idx}
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
                      <div className={styles.thumbImageWrapper}>
                        <Image
                          src={thumbSrc}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="160px"
                          className={styles.thumbnailImg}
                          unoptimized
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}

            {/* 2.5 Skill Documentation Tabs Section (In Left Column for Fixed on Scroll Action Panel) */}
            <SkillDocViewer
              skillId={skill.id}
              skillTitle={skill.title}
              description={skill.description}
              defaultSkillMdMode="guide"
              roles={skill.roles}
              onSelectExample={(example) => {
                const matchIndex = thumbnails.findIndex((t) => t === example.imageUrl);
                if (matchIndex !== -1) {
                  setActiveThumbnailIndex(matchIndex);
                }
              }}
            />
          </div>

          {/* Right Column: Composite Action Panel (Fixed / Sticky on Scroll) */}
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

        {/* 3. Similar Skills Section (Figma Node 4621:371369 / 751:5602) */}
        <section
          className={styles.similarSection}
          aria-labelledby="similar-skills-heading"
        >
          <div className={styles.similarHeaderRow}>
            <h2 id="similar-skills-heading" className={styles.similarTitle}>
              Similar Skills
            </h2>
            {/* Conditional arrows: only include if similar skills count > 4 */}
            {hasMoreSimilarSkills && (
              <div className={styles.carouselControls}>
                <button
                  type="button"
                  className={styles.carouselButton}
                  onClick={handlePrevSimilar}
                  disabled={similarSkillsOffset === 0}
                  aria-label="Previous similar skills"
                  data-testid="similar-prev-btn"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.carouselButton}
                  onClick={handleNextSimilar}
                  disabled={similarSkillsOffset >= SIMILAR_SKILLS.length - 4}
                  aria-label="Next similar skills"
                  data-testid="similar-next-btn"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

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
        </section>

        {/* 4. Frequently Asked Questions (Figma Node 851:3373) */}
        <FaqSection />
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
