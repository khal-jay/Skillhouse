"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ReceiptText,
  Bookmark,
  Bot,
  ArrowRight,
  Zap,
  DownloadCloud,
  Terminal,
  CheckCircle2,
  Search,
  X,
  SlidersHorizontal,
  FolderOpen,
  Code2,
  Sparkles,
} from "lucide-react";
import { NavBar } from "@/components/features/NavBar";
import { SkillCard } from "@/components/features/SkillCard";
import { MARKETPLACE_SKILLS, SkillItem } from "@/components/features/MarketplaceView";
import { SkillDetailDrawer } from "@/components/features/SkillDetailDrawer/SkillDetailDrawer";
import { Footer } from "@/components/features/Footer";
import styles from "./MySkillsWorkspace.module.css";

export interface MySkillsWorkspaceProps {
  savedSkillIds: string[];
  installedSkillIds: string[];
  onToggleBookmark: (skillId: string) => void;
  onToggleInstall: (skillId: string) => void;
  onNavigateHome: () => void;
  onNavigateMarketplace: () => void;
  onNavigateDesignSystem?: () => void;
  onSelectSkillDetail?: (skillId: string) => void;
  onOpenCommandPalette?: () => void;
  onRequestSkill?: () => void;
  onOpenLoginModal?: () => void;
  isSignedIn?: boolean;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
    provider?: "google" | "github";
  } | null;
  onSignOut?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenHelpCenter?: () => void;
}

export const MySkillsWorkspace: React.FC<MySkillsWorkspaceProps> = ({
  savedSkillIds,
  installedSkillIds,
  onToggleBookmark,
  onToggleInstall,
  onNavigateHome,
  onNavigateMarketplace,
  onNavigateDesignSystem,
  onSelectSkillDetail,
  onOpenCommandPalette,
  onRequestSkill,
  onOpenLoginModal,
  isSignedIn = false,
  user,
  onSignOut,
  onOpenProfile,
  onOpenSettings,
  onOpenHelpCenter,
}) => {
  const [activeTab, setActiveTab] = useState<"saved" | "installed">("saved");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();
  const [drawerSkill, setDrawerSkill] = useState<SkillItem | null>(null);

  // Extract skills belonging to user
  const savedSkills: SkillItem[] = useMemo(() => {
    return MARKETPLACE_SKILLS.filter((s) => savedSkillIds.includes(s.id));
  }, [savedSkillIds]);

  const installedSkills: SkillItem[] = useMemo(() => {
    return MARKETPLACE_SKILLS.filter((s) => installedSkillIds.includes(s.id));
  }, [installedSkillIds]);

  const sourceList = activeTab === "saved" ? savedSkills : installedSkills;

  // Compute available categories in active list
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(sourceList.map((s) => s.category).filter(Boolean)));
    return ["All", ...cats];
  }, [sourceList]);

  // Filter list by search query and category
  const filteredList = useMemo(() => {
    return sourceList.filter((skill) => {
      const matchesSearch =
        !searchQuery.trim() ||
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sourceList, searchQuery, selectedCategory]);

  const handleCardClick = (skill: SkillItem) => {
    setDrawerSkill(skill);
    onSelectSkillDetail?.(skill.id);
  };

  const handleCloseDrawer = () => {
    setDrawerSkill(null);
  };

  return (
    <div className={styles.workspaceContainer} data-testid="my-skills-workspace-page">
      {/* 1. Universal Header Navigation */}
      <NavBar
        currentView="my-skills"
        onViewChange={(view) => {
          if (view === "home") onNavigateHome();
          else if (view === "marketplace") onNavigateMarketplace();
          else if (view === "design-system") onNavigateDesignSystem?.();
        }}
        onOpenCommandPalette={onOpenCommandPalette}
        onRequestSkill={onRequestSkill}
        onOpenLoginModal={onOpenLoginModal}
        onGetStarted={onOpenLoginModal}
        isSignedIn={isSignedIn}
        user={user || undefined}
        onSignOut={onSignOut}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
        onOpenHelpCenter={onOpenHelpCenter}
        savedSkillsCount={savedSkillIds.length}
      />

      <main className={styles.mainContent}>
        {/* 2. Workspace Header Banner (Filled State & General Header) */}
        <div className={styles.headerBanner}>
          <div className={styles.bannerHeaderRow}>
            <div className={styles.titleArea}>
              <div className={styles.categoryPill}>
                <Bot size={14} className={styles.categoryIcon} aria-hidden="true" />
                <span>Agent Workspace</span>
              </div>
              <h1 className={styles.heading}>
                {isSignedIn && user ? `${user.name}’s Workspace` : "My Skills & Active Tools"}
              </h1>
              <p className={styles.subheading}>
                Manage your saved workflows, active agent stacks, and local CLI integrations.
              </p>
            </div>

            {/* Quick Actions */}
            <div className={styles.actionButtonsRow}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onOpenCommandPalette}
                aria-label="Search all skills with command palette"
                data-testid="workspace-command-palette-btn"
              >
                <span>Quick Search</span>
                <kbd className={styles.kbd}>⌘K</kbd>
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onNavigateMarketplace}
                data-testid="workspace-browse-marketplace-btn"
              >
                <span>Browse Marketplace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Connected Agent Status Bar */}
          <div className={styles.agentStatusBar}>
            <div className={styles.statusDot} />
            <div className={styles.agentStatusText}>
              <strong>Active Agent Environment:</strong> Claude Code &middot; Antigravity IDE &middot; Cursor
            </div>
            <div className={styles.agentSyncBadge}>
              <CheckCircle2 size={14} />
              <span>Synced Locally</span>
            </div>
          </div>
        </div>

        {/* 3. Tab Switcher & Search Bar */}
        <div className={styles.toolbarRow}>
          <div className={styles.tabBar} role="tablist" aria-label="Workspace tabs">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "saved"}
              className={`${styles.tabBtn} ${activeTab === "saved" ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab("saved");
                setSelectedCategory("All");
              }}
              data-testid="tab-saved-skills"
            >
              <Bookmark size={16} aria-hidden="true" />
              <span>Saved Skills</span>
              <span className={styles.tabBadge}>{savedSkillIds.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "installed"}
              className={`${styles.tabBtn} ${activeTab === "installed" ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab("installed");
                setSelectedCategory("All");
              }}
              data-testid="tab-installed-skills"
            >
              <DownloadCloud size={16} aria-hidden="true" />
              <span>Installed Tools</span>
              <span className={styles.tabBadge}>{installedSkillIds.length}</span>
            </button>
          </div>

          {/* Search Box if user has items */}
          {sourceList.length > 0 && (
            <div className={styles.searchBox}>
              <Search size={15} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                placeholder="Filter saved skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Filter saved skills"
                data-testid="workspace-filter-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.clearSearchBtn}
                  aria-label="Clear filter"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4. Category Filter Pills (when filled and multiple categories exist) */}
        {sourceList.length > 0 && availableCategories.length > 2 && (
          <div className={styles.categoryFiltersRow} role="group" aria-label="Filter by category">
            <SlidersHorizontal size={14} className={styles.filterLeadIcon} aria-hidden="true" />
            <div className={styles.pillsScroll}>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.categoryFilterPill} ${
                    selectedCategory === cat ? styles.categoryFilterPillActive : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`category-pill-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Main Content Section: Empty State vs Filled Grid */}
        <div className={styles.contentSection}>
          {sourceList.length === 0 ? (
            /* Figma Node 4687:201493 — Empty State */
            <div className={styles.emptyContainer} data-testid="workspace-empty-state">
              <div className={styles.emptyIconBox}>
                {activeTab === "saved" ? (
                  <ReceiptText size={32} strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Terminal size={32} strokeWidth={1.5} aria-hidden="true" />
                )}
              </div>
              <h2 className={styles.emptyTitle}>
                {activeTab === "saved"
                  ? "No saved skills yet"
                  : "No installed tools configured"}
              </h2>
              <p className={styles.emptyDescription}>
                {activeTab === "saved"
                  ? "Save your favorite AI agent workflows from the marketplace to build your tailored team stack."
                  : "Install workflows using our 1-click CLI prompt to configure your agent's live runtime."}
              </p>

              {/* Action Buttons */}
              <div className={styles.emptyActionsRow}>
                <button
                  type="button"
                  className={styles.exploreMarketplaceBtn}
                  onClick={onNavigateMarketplace}
                  data-testid="empty-state-explore-btn"
                >
                  <Zap size={16} />
                  <span>Explore Skills Marketplace</span>
                </button>

                {onRequestSkill && (
                  <button
                    type="button"
                    className={styles.emptyRequestBtn}
                    onClick={onRequestSkill}
                    data-testid="empty-state-request-btn"
                  >
                    <span>Request a custom skill</span>
                  </button>
                )}
              </div>

              {/* Workflow Highlights / Feature Cards */}
              <div className={styles.emptyHighlightsGrid}>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <FolderOpen size={18} />
                  </div>
                  <h3>Curated Workflows</h3>
                  <p>Production-verified prompts and skill sets for Claude, Cursor, and Codex.</p>
                </div>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <Code2 size={18} />
                  </div>
                  <h3>1-Click CLI Setup</h3>
                  <p>Instant terminal integration with zero configuration or API key hassles.</p>
                </div>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <Sparkles size={18} />
                  </div>
                  <h3>Instant Sync</h3>
                  <p>Saved skills stay synchronized across all your browser tabs and sessions.</p>
                </div>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            /* Search yielded 0 results */
            <div className={styles.noSearchResults} data-testid="no-search-results">
              <Search size={28} className={styles.noSearchIcon} />
              <h3>No skills match &quot;{searchQuery}&quot;</h3>
              <p>Try searching for a different keyword or resetting your category filter.</p>
              <button
                type="button"
                className={styles.resetFiltersBtn}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Figma Node 4687:203867 — Filled State Grid with Sinedogma Tilt Mechanics */
            <div className={styles.skillsGrid} data-testid="workspace-skills-grid">
              {filteredList.map((skill) => (
                <SkillCard
                  key={skill.id}
                  id={`skill-${skill.id}`}
                  title={skill.title}
                  category={skill.category}
                  previewImage={skill.previewImage}
                  models={skill.models}
                  isBookmarked={savedSkillIds.includes(skill.id)}
                  onBookmarkToggle={() => {
                    if (activeTab === "saved") {
                      onToggleBookmark(skill.id);
                    } else if (onToggleInstall) {
                      onToggleInstall(skill.id);
                    }
                  }}
                  onClick={() => handleCardClick(skill)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 6. Figma Node 4687:205241 — Interactive Skill Detail Drawer */}
      <SkillDetailDrawer
        isOpen={Boolean(drawerSkill)}
        skill={drawerSkill}
        onClose={handleCloseDrawer}
        isBookmarked={drawerSkill ? savedSkillIds.includes(drawerSkill.id) : false}
        onToggleBookmark={(id) => onToggleBookmark(id)}
        isInstalled={drawerSkill ? installedSkillIds.includes(drawerSkill.id) : false}
        onToggleInstall={(id) => onToggleInstall(id)}
        onExpandFullPage={(id) => {
          if (onSelectSkillDetail) onSelectSkillDetail(id);
          else if (typeof window !== "undefined") {
            router.push(`/skills/${id}`);
          }
        }}
      />

      {/* 7. Universal Footer */}
      <Footer
        onSelectCategory={() => onNavigateMarketplace()}
        onNavigateMarketplace={onNavigateMarketplace}
      />
    </div>
  );
};
