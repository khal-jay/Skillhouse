"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Maximize2,
  Bookmark,
  Check,
  Copy,
  Terminal,
  Bot,
  ShieldCheck,
  Play,
  Layers,
} from "lucide-react";
import { SkillItem } from "@/components/features/MarketplaceView";
import { SkillPlayground } from "@/components/features/SkillPlayground";
import { useScrollLock } from "@/lib/useScrollLock";
import styles from "./SkillDetailDrawer.module.css";

export interface SkillDetailDrawerProps {
  isOpen: boolean;
  skill: SkillItem | null;
  onClose: () => void;
  onExpandFullPage?: (skillId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (skillId: string) => void;
  isInstalled?: boolean;
  onToggleInstall?: (skillId: string) => void;
  onOpenLoginModal?: () => void;
  isSignedIn?: boolean;
}

type DrawerTab = "install" | "overview" | "playground";
type AgentFormat = "npx" | "cursor" | "claude" | "openai";

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({
  isOpen,
  skill,
  onClose,
  onExpandFullPage,
  isBookmarked = false,
  onToggleBookmark,
  isInstalled = false,
  onToggleInstall,
}) => {
  useScrollLock(isOpen);

  const [activeTab, setActiveTab] = useState<DrawerTab>("install");
  const [selectedFormat, setSelectedFormat] = useState<AgentFormat>("npx");
  const [copied, setCopied] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !skill) return null;

  const getFormatSnippet = (format: AgentFormat): string => {
    switch (format) {
      case "npx":
        return skill.installPrompt || `npx skillhouse add ${skill.id}`;
      case "cursor":
        return `// .cursorrules config for Skillhouse: ${skill.title}\n{ "skills": ["skillhouse/${skill.id}@${skill.version}"], "runtime": "auto" }`;
      case "claude":
        return `// claude_desktop_config.json\n{\n  "mcpServers": {\n    "${skill.id}": {\n      "command": "npx",\n      "args": ["-y", "@skillhouse/${skill.id}"]\n    }\n  }\n}`;
      case "openai":
        return `{\n  "type": "function",\n  "function": {\n    "name": "${skill.id.replace(/-/g, "_")}",\n    "description": "${skill.description.slice(0, 100)}..."\n  }\n}`;
    }
  };

  const handleCopySnippet = () => {
    const snippet = getFormatSnippet(selectedFormat);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickInstall = () => {
    handleCopySnippet();
    if (onToggleInstall && !isInstalled) {
      onToggleInstall(skill.id);
    }
    setInstallSuccess(true);
    setTimeout(() => setInstallSuccess(false), 2500);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="presentation"
      data-testid="skill-drawer-backdrop"
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={`${skill.title} details`}
        onClick={(e) => e.stopPropagation()}
        data-testid="skill-detail-drawer"
      >
        {/* Drawer Navigation Bar */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.categoryBadge}>{skill.category}</span>
            <span className={styles.priceBadge}>
              {skill.isFree ? "Free" : skill.price}
            </span>
          </div>

          <div className={styles.headerActions}>
            {onExpandFullPage && (
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => onExpandFullPage(skill.id)}
                aria-label="Expand to full page"
                title="Expand to full page view"
                data-testid="drawer-expand-btn"
              >
                <Maximize2 size={16} />
              </button>
            )}
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Close drawer"
              data-testid="drawer-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className={styles.drawerBody}>
          {/* Skill Title & Verified Badge */}
          <div className={styles.titleSection}>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{skill.title}</h2>
              <span className={styles.versionBadge}>{skill.version}</span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.verifiedTag}>
                <ShieldCheck size={14} className={styles.verifiedIcon} />
                <span>Verified Agent Tool</span>
              </span>
              {skill.installs && (
                <span className={styles.statTag}>
                  {skill.installs.toLocaleString()} installs
                </span>
              )}
            </div>
          </div>

          {/* Preview Image */}
          <div className={styles.previewContainer}>
            <Image
              src={skill.previewImage || "/figma/skill-card-preview.png"}
              alt={skill.title}
              width={640}
              height={360}
              className={styles.previewImage}
              unoptimized
            />
          </div>

          {/* Supported Agent Models Row */}
          {skill.models && skill.models.length > 0 && (
            <div className={styles.modelsSection}>
              <span className={styles.modelsLabel}>Compatible Environments:</span>
              <div className={styles.modelsList}>
                {skill.models.map((logo, idx) => (
                  <div key={idx} className={styles.modelIconBox}>
                    <Image
                      src={logo}
                      alt="Agent model"
                      width={20}
                      height={20}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tabs: 1-Click Install vs Overview vs Playground */}
          <div className={styles.tabBar} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "install"}
              className={`${styles.tabBtn} ${activeTab === "install" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("install")}
              data-testid="drawer-tab-install"
            >
              <Terminal size={14} />
              <span>1-Click Install</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "overview"}
              className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("overview")}
              data-testid="drawer-tab-overview"
            >
              <Layers size={14} />
              <span>Specs &amp; Details</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "playground"}
              className={`${styles.tabBtn} ${activeTab === "playground" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("playground")}
              data-testid="drawer-tab-playground"
            >
              <Play size={14} />
              <span>Live Playground</span>
            </button>
          </div>

          {/* Tab 1: 1-Click Agent Install */}
          {activeTab === "install" && (
            <div className={styles.installPanel}>
              <p className={styles.panelDesc}>
                Export this verified workflow directly into your local AI agent CLI, Cursor rules, or Claude Desktop MCP configuration.
              </p>

              {/* Agent Format Selector */}
              <div className={styles.formatSelector} role="radiogroup" aria-label="Agent Format">
                <button
                  type="button"
                  className={`${styles.formatPill} ${selectedFormat === "npx" ? styles.formatActive : ""}`}
                  onClick={() => setSelectedFormat("npx")}
                >
                  npx CLI
                </button>
                <button
                  type="button"
                  className={`${styles.formatPill} ${selectedFormat === "cursor" ? styles.formatActive : ""}`}
                  onClick={() => setSelectedFormat("cursor")}
                >
                  Cursor
                </button>
                <button
                  type="button"
                  className={`${styles.formatPill} ${selectedFormat === "claude" ? styles.formatActive : ""}`}
                  onClick={() => setSelectedFormat("claude")}
                >
                  Claude Desktop
                </button>
                <button
                  type="button"
                  className={`${styles.formatPill} ${selectedFormat === "openai" ? styles.formatActive : ""}`}
                  onClick={() => setSelectedFormat("openai")}
                >
                  OpenAI JSON
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className={styles.codeSnippetBox}>
                <pre className={styles.codeContent}>
                  <code>{getFormatSnippet(selectedFormat)}</code>
                </pre>
                <button
                  type="button"
                  className={styles.copySnippetBtn}
                  onClick={handleCopySnippet}
                  aria-label="Copy code snippet"
                >
                  {copied ? <Check size={14} color="#027A48" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Install Status Indicator */}
              <div className={styles.installStatusRow}>
                <div className={styles.installStatusLeft}>
                  <Bot size={16} className={styles.statusBotIcon} />
                  <span>
                    Status in My Agent:{" "}
                    <strong>{isInstalled ? "Installed & Active" : "Not yet installed"}</strong>
                  </span>
                </div>
                {onToggleInstall && (
                  <button
                    type="button"
                    className={styles.toggleInstallBtn}
                    onClick={() => onToggleInstall(skill.id)}
                  >
                    {isInstalled ? "Uninstall" : "Mark Installed"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Specs & Overview */}
          {activeTab === "overview" && (
            <div className={styles.overviewPanel}>
              <div className={styles.overviewBlock}>
                <h4 className={styles.blockTitle}>Description</h4>
                <p className={styles.descriptionText}>{skill.description}</p>
              </div>

              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Output Type:</span>
                  <span className={styles.specValue}>{skill.output}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Use Case:</span>
                  <span className={styles.specValue}>{skill.useCase}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Roles:</span>
                  <span className={styles.specValue}>
                    {skill.roles ? skill.roles.join(", ") : "All creators"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Live Playground */}
          {activeTab === "playground" && (
            <div className={styles.playgroundPanel}>
              <SkillPlayground />
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer Actions */}
        <div className={styles.drawerFooter}>
          {onToggleBookmark && (
            <button
              type="button"
              data-testid="drawer-bookmark-btn" className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ""}`}
              onClick={() => onToggleBookmark(skill.id)}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
            >
              <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              <span>{isBookmarked ? "Saved" : "Save Skill"}</span>
            </button>
          )}

          <button
            type="button"
            data-testid="drawer-quick-install-btn" className={styles.installPrimaryBtn}
            onClick={handleQuickInstall}
          >
            {installSuccess ? (
              <>
                <Check size={16} />
                <span>Installed &amp; Copied!</span>
              </>
            ) : (
              <>
                <Terminal size={16} />
                <span>Copy &amp; Install Workflow</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};
