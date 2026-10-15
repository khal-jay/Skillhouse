"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Bookmark, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { NavBar } from "@/components/features/NavBar";
import { SkillCard } from "@/components/features/SkillCard";
import { MARKETPLACE_SKILLS, SkillItem } from "@/components/features/MarketplaceView";
import { SkillDetailDrawer } from "@/components/features/SkillDetailDrawer/SkillDetailDrawer";
import { Footer } from "@/components/features/Footer";
import styles from "./MySkillsWorkspace.module.css";

export interface MySkillsWorkspaceProps {
  initialTab?: "bookmark" | "installed";
  onTabChange?: (tab: "bookmark" | "installed") => void;
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


// Figma Icons for Horizontal Tabs & Table
const ArchiveBookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11.6667 12.25V3.5C11.6667 2.5335 10.8832 1.75 9.91667 1.75H4.08333C3.11684 1.75 2.33333 2.5335 2.33333 3.5V12.25L7 9.91667L11.6667 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.66667 4.66667H9.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const ImportTrayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.08337 6.41667L7.00004 9.33333L9.91671 6.41667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9.33333V2.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6667 8.16667V11.0833C11.6667 11.4055 11.4055 11.6667 11.0833 11.6667H2.91671C2.59454 11.6667 2.33337 11.4055 2.33337 11.0833V8.16667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SortChevron = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.sortIcon}
    aria-hidden="true"
  >
    <path
      d="M4.375 5.25L7 2.625L9.625 5.25"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.375 8.75L7 11.375L9.625 8.75"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ITEMS_PER_PAGE = 9;

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
  initialTab = "bookmark",
  onTabChange,
}) => {
  // Figma Node 886:26410: tabs are "Bookmark" and "Installed"
  const [activeTab, setActiveTab] = useState<"bookmark" | "installed">(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerSkill, setDrawerSkill] = useState<SkillItem | null>(null);
  const [sortColumn, setSortColumn] = useState<"category" | "update" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [updatedSkillIds, setUpdatedSkillIds] = useState<string[]>([]);

  const handleSort = (col: "category" | "update") => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const handleInstallUpdate = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdatedSkillIds((prev) => [...prev, skillId]);
  };

  const hasUpdate = (skill: SkillItem, index: number) => {
    if (updatedSkillIds.includes(skill.id)) return false;
    return index === 1 || index === 7 || index === 8;
  };

  const getCategoryName = (category?: string, index?: number) => {
    if (category) return category;
    const figmaCategories = [
      "Web design",
      "Brand design",
      "Front-end development",
      "Technical writing",
      "Presentation",
    ];
    return figmaCategories[(index ?? 0) % figmaCategories.length];
  };

  // Extract skills belonging to user
  const bookmarkedSkills: SkillItem[] = useMemo(() => {
    return MARKETPLACE_SKILLS.filter((s) => savedSkillIds.includes(s.id));
  }, [savedSkillIds]);

  const installedSkills: SkillItem[] = useMemo(() => {
    return MARKETPLACE_SKILLS.filter((s) => installedSkillIds.includes(s.id));
  }, [installedSkillIds]);

  const sourceList = activeTab === "bookmark" ? bookmarkedSkills : installedSkills;

  // Filter list by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return sourceList;
    const q = searchQuery.toLowerCase();
    return sourceList.filter(
      (skill) =>
        skill.title.toLowerCase().includes(q) ||
        skill.category?.toLowerCase().includes(q) ||
        skill.description?.toLowerCase().includes(q)
    );
  }, [sourceList, searchQuery]);

  // Pagination for installed table view
  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const sortedList = useMemo(() => {
    if (!sortColumn) return filteredList;
    return [...filteredList].sort((a, b) => {
      let valA = "";
      let valB = "";
      if (sortColumn === "category") {
        valA = a.category || "";
        valB = b.category || "";
      } else if (sortColumn === "update") {
        valA = a.createdAt || "";
        valB = b.createdAt || "";
      }
      const cmp = valA.localeCompare(valB);
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filteredList, sortColumn, sortDirection]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedList.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedList, currentPage]);

  const handleCardClick = (skill: SkillItem) => {
    setDrawerSkill(skill);
    onSelectSkillDetail?.(skill.id);
  };

  const handleCloseDrawer = () => {
    setDrawerSkill(null);
  };

  const handleTabChange = (tab: "bookmark" | "installed") => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
    onTabChange?.(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className={styles.pageContainer} data-testid="my-skills-workspace-page">
      {/* 1. Global Navigation Bar */}
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
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        searchInputTestId="workspace-filter-input"
      />

      <main className={styles.mainContent}>
        {/* 2. Top Header Row: Title */}
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>My Skills</h1>
        </div>

        {/* 3. Horizontal Tabs: Bookmark & Installed (Figma Node 886:26410) */}
        <div className={styles.tabsRow}>
          <div
            className={styles.horizontalTabs}
            role="tablist"
            aria-label="My Skills sections"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "bookmark"}
              className={`${styles.tabButton} ${
                activeTab === "bookmark" ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
              onClick={() => handleTabChange("bookmark")}
              data-testid="tab-saved-skills"
            >
              <ArchiveBookIcon />
              <span>Bookmark</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "installed"}
              className={`${styles.tabButton} ${
                activeTab === "installed" ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
              onClick={() => handleTabChange("installed")}
              data-testid="tab-installed-skills"
            >
              <ImportTrayIcon />
              <span>Installed</span>
            </button>
          </div>
        </div>

        {/* 4. Tab Content Area */}
        <div className={styles.contentSection}>
          {activeTab === "bookmark" ? (
            /* =================== BOOKMARK VIEW =================== */
            bookmarkedSkills.length === 0 ? (
              /* State 1: Bookmark Empty (Figma Node 898:10686) */
              <div
                className={styles.emptyStateContainer}
                data-testid="workspace-empty-state"
              >
                <div className={styles.emptyStateCard}>
                  <div className={styles.emptyIconWrapper} aria-hidden="true">
                    <Image
                      src="/figma/empty_archive_book.svg"
                      alt=""
                      width={66}
                      height={73}
                      className={styles.emptyIconSvg}
                      priority
                    />
                  </div>
                  <div className={styles.emptyTextGroup}>
                    <h2 className={styles.emptyHeading}>No bookmarks found</h2>
                    <p className={styles.emptySubtext}>
                      You have no skill bookmarked at this time
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.emptyActionBtn}
                    onClick={onNavigateMarketplace}
                    data-testid="workspace-empty-bookmark-cta"
                  >
                    Bookmark skill
                  </button>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              /* Search query produced no matches */
              <div className={styles.noResultsBox} data-testid="no-search-results">
                <p className={styles.noResultsTitle}>No bookmarked skills match &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Reset search filters"
                >
                  Clear search
                </button>
              </div>
            ) : (
              /* State 2: Bookmark Filled Grid (Figma Node 886:26345 - 4-column rectangular cards) */
              <div className={styles.skillsGrid} data-testid="workspace-skills-grid">
                {filteredList.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    id={`skill-${skill.id}`}
                    title={skill.title}
                    category={skill.category}
                    previewImage={skill.previewImage || "/figma/pixel_promo_cover.jpg"}
                    models={skill.models || [
                      "/figma/badge_starburst.svg",
                      "/figma/badge_rainbow_arch.png",
                      "/figma/badge_kling.png",
                    ]}
                    installs={skill.installs}
                    showOverlays={true}
                    isBookmarked={true}
                    onBookmarkToggle={() => onToggleBookmark(skill.id)}
                    onClick={() => handleCardClick(skill)}
                  />
                ))}
              </div>
            )
          ) : (
            /* =================== INSTALLED VIEW =================== */
            installedSkills.length === 0 ? (
              /* State 3: Installed Empty (Figma Node 898:10709) */
              <div
                className={styles.emptyStateContainer}
                data-testid="workspace-installed-empty-state"
              >
                <div className={styles.emptyStateCard}>
                  <div className={styles.emptyIconWrapper} aria-hidden="true">
                    <Image
                      src="/figma/empty_import.svg"
                      alt=""
                      width={69}
                      height={70}
                      className={styles.emptyIconSvg}
                      priority
                    />
                  </div>
                  <div className={styles.emptyTextGroup}>
                    <h2 className={styles.emptyHeading}>No installed skill found</h2>
                    <p className={styles.emptySubtext}>
                      You have no skill installed at this time
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.emptyActionBtn}
                    onClick={onNavigateMarketplace}
                    data-testid="workspace-empty-install-cta"
                  >
                    Install a skill
                  </button>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              /* Search query produced no matches in installed skills */
              <div className={styles.noResultsBox} data-testid="no-search-results">
                <p className={styles.noResultsTitle}>No installed skills match &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Reset search filters"
                >
                  Clear search
                </button>
              </div>
            ) : (
              /* State 4: Installed Filled Table (Figma Node 886:22807) */
              <div className={styles.tableCard} data-testid="workspace-installed-table" role="table" aria-label="Installed skills table">
                {/* Table Header Row (Figma Node 886:22857) */}
                <div className={styles.tableHeaderRow} role="row">
                  <div className={styles.colSkillName} role="columnheader">Skill name</div>
                  <div className={styles.colCategory} role="columnheader">
                    <button
                      type="button"
                      className={styles.sortHeaderBtn}
                      onClick={() => handleSort("category")}
                      aria-label="Sort by category"
                    >
                      <span>Category</span>
                      <SortChevron />
                    </button>
                  </div>
                  <div className={styles.colLastUpdate} role="columnheader">
                    <button
                      type="button"
                      className={styles.sortHeaderBtn}
                      onClick={() => handleSort("update")}
                      aria-label="Sort by latest update"
                    >
                      <span>Latest update</span>
                      <SortChevron />
                    </button>
                  </div>
                </div>

                {/* Table Body Rows */}
                <div className={styles.tableBody} role="rowgroup">
                  {paginatedList.map((skill, index) => {
                    const updateAvailable = hasUpdate(skill, index);
                    const categoryName = getCategoryName(skill.category, index);

                    return (
                      <div
                        key={skill.id}
                        className={styles.tableRow}
                        onClick={() => handleCardClick(skill)}
                        tabIndex={0}
                        role="row"
                        aria-label={`${skill.title}, ${categoryName}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCardClick(skill);
                          }
                        }}
                        data-testid={`installed-row-${skill.id}`}
                      >
                        {/* Column 1: Skill Name with Thumbnail (Figma 61x34) */}
                        <div className={styles.colSkillName} role="cell">
                          <div className={styles.skillThumbnail}>
                            <Image
                              src={skill.previewImage || "/figma/installed_skill_thumb.png"}
                              alt=""
                              width={61}
                              height={34}
                              className={styles.thumbImg}
                            />
                          </div>
                          <span className={styles.skillTitle}>{skill.title}</span>
                        </div>

                        {/* Column 2: Category Pill Badge with Flag Emoji */}
                        <div className={styles.colCategory} role="cell">
                          <span className={styles.categoryBadge}>
                            <span className={styles.categoryFlag} aria-hidden="true">🇲🇾</span>
                            <span>{categoryName}</span>
                          </span>
                        </div>

                        {/* Column 3: Latest Update with Install Link (Figma Node 886:22857) */}
                        <div className={styles.colLastUpdate} role="cell">
                          {updateAvailable ? (
                            <span className={styles.updateText}>
                              Update available -&nbsp;
                              <button
                                type="button"
                                className={styles.installActionLink}
                                onClick={(e) => handleInstallUpdate(skill.id, e)}
                              >
                                Install
                              </button>
                            </span>
                          ) : (
                            <span className={styles.dashText} aria-label="Up to date">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Pagination Bar (Figma Node 886:23342) */}
                <div className={styles.paginationBar}>
                  <div className={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className={styles.pageNumbers}>
                    {totalPages <= 7 ? (
                      Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={page === currentPage ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          type="button"
                          className={currentPage === 1 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                        <button
                          type="button"
                          className={currentPage === 2 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(2)}
                        >
                          2
                        </button>
                        <button
                          type="button"
                          className={currentPage === 3 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(3)}
                        >
                          3
                        </button>
                        <span className={styles.pageEllipsis} aria-hidden="true">…</span>
                        <button
                          type="button"
                          className={currentPage === 10 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(10)}
                        >
                          10
                        </button>
                        <button
                          type="button"
                          className={currentPage === 11 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(11)}
                        >
                          11
                        </button>
                        <button
                          type="button"
                          className={currentPage === 12 ? styles.pageNumberActive : styles.pageNumberBtn}
                          onClick={() => setCurrentPage(12)}
                        >
                          12
                        </button>
                      </>
                    )}
                  </div>

                  <div className={styles.paginationControls}>
                    <button
                      type="button"
                      className={styles.navControlBtn}
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12.6667 8H3.33334" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12.6667L3.33334 8L8 3.33334" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      className={styles.navControlBtn}
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 3.33334L12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* 5. Authentic Skillhouse Footer */}
      <Footer
        onSelectCategory={() => onNavigateMarketplace()}
        onNavigateMarketplace={onNavigateMarketplace}
      />

      {/* 6. Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={drawerSkill}
        isOpen={Boolean(drawerSkill)}
        onClose={handleCloseDrawer}
        isBookmarked={
          drawerSkill ? savedSkillIds.includes(drawerSkill.id) : false
        }
        isInstalled={
          drawerSkill ? installedSkillIds.includes(drawerSkill.id) : false
        }
        onToggleBookmark={() => {
          if (drawerSkill) onToggleBookmark(drawerSkill.id);
        }}
        onToggleInstall={() => {
          if (drawerSkill) onToggleInstall(drawerSkill.id);
        }}
        onOpenLoginModal={onOpenLoginModal}
        isSignedIn={isSignedIn}
      />
    </div>
  );
};
