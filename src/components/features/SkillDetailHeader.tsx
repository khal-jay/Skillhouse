"use client";

import { BookmarkButton } from "../ui/BookmarkButton";
import { BookmarkIcon } from "../ui/BookmarkIcon";

import React, { useState } from "react";
import {
  Share,
  Download,
  Tag,
  ShieldCheck,
  Copy,
  Info,
} from "lucide-react";
import { SkillAudienceBox } from "./SkillAudienceBox";
import { SkillRuntimeSpecs } from "./SkillRuntimeSpecs";
import { SubscriptionBanner } from "../ui/SubscriptionBanner";
import styles from "./SkillDetailHeader.module.css";

export interface SkillDetailHeaderProps {
  title?: string;
  version?: string;
  price?: string;
  description?: string;
  installPrompt?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (isBookmarked: boolean) => void;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onBuy?: () => void;
  isFree?: boolean;
  variant?: "free" | "premium";
  showRuntimeSpecs?: boolean;
  className?: string;
}

export const SkillDetailHeader: React.FC<SkillDetailHeaderProps> = ({
  title = "Visual Canvas Deck",
  version = "v1.0.1",
  price = "$5",
  description = "Create an exploratory presentation that turns a rough brief into editable spatial compositions and a coherent deck. It supports visual iteration through addressable canvases, clear outline approval, and a browser-ready presentation. Every deck can be edited in the browser and exported as an editable PowerPoint file.",
  installPrompt = "npx skillhouse add visual-canvas-deck",
  isBookmarked: initialBookmarked = false,
  onBookmarkToggle,
  isSubscribed = false,
  onSubscribe,
  isFree: propIsFree,
  variant: propVariant,
  showRuntimeSpecs = true,
  className = "",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine state: explicit variant prop wins, otherwise check isFree or price
  const isFreeState =
    propVariant === "free"
      ? true
      : propVariant === "premium"
      ? false
      : propIsFree !== undefined
      ? propIsFree
      : price.toLowerCase().includes("free");

  const handleBookmarkToggle = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    onBookmarkToggle?.(next);
    setToastMessage(next ? "Skill added to bookmarks!" : "Skill removed from bookmarks");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(installPrompt);
      setCopied(true);
      setToastMessage("Install prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleDownloadZip = () => {
    if (typeof document !== "undefined") {
      const link = document.createElement("a");
      link.href = "/downloads/visual-canvas-deck.zip";
      link.download = "visual-canvas-deck.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setToastMessage("Preparing skill archive bundle download...");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const modelLogos = [
    "/figma/logo-1.png",
    "/figma/logo-2.png",
    "/figma/logo-3.png",
    "/figma/logo-4.png",
    "/figma/logo-5.png",
    "/figma/logo-6.png",
  ];

  return (
    <section
      className={`${styles.panel} ${className}`}
      aria-label="Skill details and actions"
      data-testid="composite-skill-action-panel"
      data-variant={isFreeState ? "free" : "premium"}
    >
      {/* 1. Header Top Action Block (Figma Nodes 752:11246 / 752:11110) */}
      <div className={styles.topActionBlock}>
        {/* Row A: Title & Round Action Buttons (Nodes 752:11247 / 752:11111) */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.roundActionButtons}>
            <BookmarkButton
              variant="round"
              isBookmarked={isBookmarked}
              onToggle={handleBookmarkToggle}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Bookmark skill"}
            />

            <button
              type="button"
              className={styles.roundButton}
              aria-label="Share skill"
              title="Share skill"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard?.writeText?.(window.location.href);
                }
                setToastMessage("Link copied to clipboard!");
                setTimeout(() => setToastMessage(null), 2500);
              }}
            >
              <Share size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Row B: Meta Stats Row (Nodes 752:11255 / 752:11119) */}
        <div className={styles.metaStatsRow}>
          <span className={styles.statItem} title="Installs">
            <Download size={14} aria-hidden="true" />
            <span>295</span>
          </span>

          <span className={styles.statItem} title="Saved">
            <BookmarkIcon size={14} aria-hidden="true" />
            <span>295</span>
          </span>

          <span className={styles.statItem} title="Version">
            <Tag size={13} aria-hidden="true" />
            <span>{version}</span>
          </span>

          <span className={styles.statItem} title="Security status">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Secure</span>
          </span>
        </div>

        {/* Row C: Monetization State (Free Node 752:11273 vs Premium Node 752:11137) */}
        {isFreeState ? (
          <div className={styles.freePriceRow} data-testid="free-price-indicator">
            <span className={styles.freePriceText}>Free</span>
          </div>
        ) : (
          <SubscriptionBanner
            isSubscribed={isSubscribed}
            onSubscribe={onSubscribe}
            testId="premium-subscription-banner"
          />
        )}

        {/* Row D: Primary Action Buttons (Nodes 752:11275 / 752:11154) */}
        <div className={styles.actionButtonsRow}>
          <button
            type="button"
            className={styles.copyPromptBtn}
            onClick={handleCopyPrompt}
            aria-label={copied ? "Prompt Copied!" : "Copy install prompt"}
          >
            <Copy size={16} aria-hidden="true" />
            <span>{copied ? "Prompt Copied!" : "Copy install prompt"}</span>
          </button>

          <button
            type="button"
            className={styles.downloadZipBtn}
            onClick={handleDownloadZip}
            aria-label="Download ZIP archive"
          >
            <Download size={16} aria-hidden="true" />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      {/* Explicit Section Divider Line (Nodes 752:11284 / 752:11163) */}
      <hr className={styles.sectionDivider} />

      {/* 2. Description Block & Help Link (Nodes 752:11285 / 752:11164) */}
      <div className={styles.descriptionBlock}>
        <p className={styles.descriptionText}>{description}</p>

        <button
          type="button"
          className={styles.infoLink}
          onClick={() => setShowInfo(!showInfo)}
          aria-expanded={showInfo}
        >
          <Info size={12} aria-hidden="true" />
          <span>What do I get when I buy this Skill?</span>
        </button>

        {showInfo && (
          <div className={styles.infoModalContent} role="region" aria-label="Purchase details">
            <strong>Included in this package:</strong>
            <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
              <li>Full SKILL.md system prompt instructions and XML schemas</li>
              <li>Pre-configured scripts for browser export and PPTX compilation</li>
              <li>Ready-to-use template assets for Claude, Cursor, and OpenAI</li>
              <li>Continuous updates and verified security compatibility</li>
            </ul>
          </div>
        )}
      </div>

      {/* 3. Audience Box (Nodes 752:11291 / 752:11170) */}
      <SkillAudienceBox
        label="This skill is often used by"
        roles={["Product Manager", "Graphic Designer", "Art Director"]}
        lastUpdated="Last updated Oct 3, 2026"
      />

      {/* 4. Runtime & Guide Specs (Nodes 752:11309 / 752:11188) */}
      {showRuntimeSpecs && (
        <SkillRuntimeSpecs
          runsInModels={modelLogos}
          installGuides={["Claude Code", "Cursor"]}
          generatesWith={["Host Agent LLM"]}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
