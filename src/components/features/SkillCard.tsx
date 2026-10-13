"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { BookmarkButton } from "../ui/BookmarkButton";
import styles from "./SkillCard.module.css";

export const CARD_GRADIENTS = [
  "linear-gradient(135deg, #DCDCDC 0%, #CACACA 100%)", // Neutral Greyscale 1
  "linear-gradient(135deg, #E0E0E0 0%, #D0D0D0 100%)", // Neutral Greyscale 2
  "linear-gradient(135deg, #D8D8D8 0%, #C6C6C6 100%)", // Neutral Greyscale 3
  "linear-gradient(135deg, #E2E2E2 0%, #D2D2D2 100%)", // Neutral Greyscale 4
  "linear-gradient(135deg, #DADADA 0%, #C8C8C8 100%)", // Neutral Greyscale 5
  "linear-gradient(135deg, #E4E4E4 0%, #D4D4D4 100%)", // Neutral Greyscale 6
];

export function getCardGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CARD_GRADIENTS.length;
  return CARD_GRADIENTS[index];
}

export interface SkillCardProps {
  id?: string;
  title: string;
  category?: string;
  previewImage?: string;
  models?: string[];
  isBookmarked?: boolean;
  onBookmarkToggle?: (isBookmarked: boolean) => void;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  installs?: number;
  accentGradient?: string;
  accessBadge?: string;
}

const SKELETON_TITLE_WIDTHS = ["72%", "58%", "82%", "64%", "76%", "60%", "88%", "68%"];

export interface SkillCardSkeletonProps {
  className?: string;
  gradientIndex?: number;
  titleWidth?: string;
}

export const SkillCardSkeleton: React.FC<SkillCardSkeletonProps> = ({
  className = "",
  gradientIndex = 0,
  titleWidth,
}) => {
  const width = titleWidth || SKELETON_TITLE_WIDTHS[gradientIndex % SKELETON_TITLE_WIDTHS.length];
  return (
    <div
      className={`${styles.skeletonCard} ${className}`}
      aria-busy="true"
      aria-label="Loading skill..."
      data-testid="skill-card-skeleton"
    >
      <div className={styles.imageContainer}>
        <div
          className={`${styles.skeletonImage} ${styles.skeletonShimmer}`}
          data-testid="skill-card-skeleton-image"
        />
      </div>
      <div className={styles.footer}>
        <div
          className={`${styles.skeletonTitle} ${styles.skeletonShimmer}`}
          style={{ width }}
        />
        <div className={styles.logomarksRow} aria-hidden="true">
          <div className={`${styles.skeletonModelDot} ${styles.skeletonShimmer}`} />
          <div className={`${styles.skeletonModelDot} ${styles.skeletonShimmer}`} />
          <div className={`${styles.skeletonModelDot} ${styles.skeletonShimmer}`} />
          <div className={`${styles.skeletonModelDot} ${styles.skeletonShimmer}`} />
        </div>
      </div>
    </div>
  );
};

export const SkillCard: React.FC<SkillCardProps> = ({
  id,
  title = "Pixel Promo Video",
  category = "Design",
  previewImage = "/figma/skill-card-preview.png",
  models = [
    "/figma/logo-1.png",
    "/figma/logo-2.png",
    "/figma/logo-3.png",
    "/figma/logo-4.png",
  ],
  isBookmarked: controlledBookmarked,
  onBookmarkToggle,
  onClick,
  className = "",
  isLoading = false,
  installs,
  accentGradient,
  accessBadge,
}) => {
  const [internalBookmarked, setInternalBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isBookmarked = controlledBookmarked !== undefined ? controlledBookmarked : internalBookmarked;

  const handleBookmarkToggle = (nextState: boolean) => {
    if (controlledBookmarked === undefined) {
      setInternalBookmarked(nextState);
    }
    onBookmarkToggle?.(nextState);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty("--tilt-x", `${(-y * 2.5).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--tilt-y", `${(x * 2.5).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--tilt-lift", "-5px");
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--tilt-x");
    e.currentTarget.style.removeProperty("--tilt-y");
    e.currentTarget.style.removeProperty("--tilt-lift");
  };

    const gradient = accentGradient || getCardGradient(id || title);

  if (isLoading) {
    return <SkillCardSkeleton className={className} />;
  }

  return (
    <div
      id={id}
      className={`${styles.card} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={styles.imageContainer}>
        {/* Smooth grey skeleton placeholder behind image container */}
        <div
          className={`${styles.skeletonImage} ${!imageLoaded && !imageError ? styles.skeletonShimmer : ""}`}
          style={imageLoaded ? { background: gradient } : undefined}
          data-testid="skill-card-gradient"
        />

        {previewImage && !imageError && (
          <Image
            src={previewImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`${styles.previewImage} ${imageLoaded ? styles.imageVisible : styles.imageHidden}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized
          />
        )}
        
        <div className={styles.imageOverlays}>
          <div className={styles.overlayPillsGroup}>
            {category ? (
              <span className={styles.pill}>{category}</span>
            ) : null}
            {accessBadge ? (
              <span className={styles.accessBadge} data-testid="skill-card-access-badge">
                {accessBadge}
              </span>
            ) : null}
          </div>
          <BookmarkButton
            size="sm"
            variant="white"
            isBookmarked={isBookmarked}
            onToggle={handleBookmarkToggle}
            stopPropagation={true}
            className={styles.bookmarkBtn}
            aria-label={isBookmarked ? "Remove from saved skills" : "Save skill to bookmarks"}
            title={isBookmarked ? "Saved" : "Bookmark skill"}
          />
        </div>

        {installs !== undefined && (
          <div className={styles.bottomMetricsPill} aria-label={`${installs} downloads`}>
            <span className={styles.metricItem}>
              <Download size={11} strokeWidth={2.4} aria-hidden="true" />
              <span>{installs}</span>
            </span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>

        <div className={styles.logomarksRow} aria-label="Supported models">
          {models.slice(0, 4).map((logo, index) => (
            <div
              key={index}
              className={styles.logomarkItem}
              title={`Supported model ${index + 1}`}
            >
              <Image
                src={logo}
                alt=""
                width={12}
                height={12}
                className={styles.logoImage}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
