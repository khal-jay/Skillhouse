"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Search,
} from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { SearchInput } from "../ui/SearchInput";
import { CategoriesDropdown, CategoryTab } from "./CategoriesDropdown";
import { UserMenuPopover } from "./UserMenuPopover";
import { useAuthSafe } from "@/lib/AuthContext";
import styles from "./NavBar.module.css";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

export type NavView = "home" | "marketplace" | "my-skills" | "design-system";

export interface NavBarProps {
  currentView?: NavView;
  onViewChange?: (view: NavView) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onOpenCommandPalette?: () => void;
  onSelectCategory?: (category: string, tab?: CategoryTab) => void;
  onRequestSkill?: () => void;
  onGetStarted?: () => void;
  onOpenLoginModal?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenHelpCenter?: () => void;
  isSignedIn?: boolean;
  onSignOut?: () => void;
  savedSkillsCount?: number;
  scrolled?: boolean;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
    provider?: "google" | "github";
  };
  responsiveMode?: "desktop" | "tablet" | "mobile";
  className?: string;
}

const navVariants = {
  top: {
    maxWidth: "1600px",
    width: "100%",
    y: 0,
    borderRadius: 0,
    backgroundColor: "rgba(255, 238, 221, 1)",
    backdropFilter: "none",
    boxShadow: "0 0 0 0px transparent",
    borderWidth: "0px",
    borderStyle: "solid",
    borderColor: "transparent",
  },
  scrolled: {
    maxWidth: "1240px",
    width: "92%",
    y: 10,
    borderRadius: 40,
    backgroundColor: "rgba(255, 238, 221, 0.88)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 16px 36px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(205, 183, 174, 0.75)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(205, 183, 174, 0.9)",
  },
};

export const NavBar: React.FC<NavBarProps> = ({
  scrolled: propScrolled,
  currentView = "home",
  onViewChange,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  onOpenCommandPalette,
  onSelectCategory,
  onRequestSkill,
  onGetStarted,
  onOpenLoginModal,
  onOpenProfile,
  onOpenSettings,
  onOpenHelpCenter,
  isSignedIn: propIsSignedIn,
  onSignOut,
  user: propUser,
  responsiveMode,
  className = "",
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [internalScrolled, setInternalScrolled] = useState(false);
  const isScrolled = propScrolled !== undefined ? propScrolled : internalScrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setInternalScrolled(true);
    } else {
      setInternalScrolled(false);
    }
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const auth = useAuthSafe();
  const effectiveSignedIn = propIsSignedIn !== undefined ? propIsSignedIn : (auth?.isSignedIn ?? false);
  const isSignedIn = isMounted ? effectiveSignedIn : (propIsSignedIn ?? false);
  const user = propUser || auth?.user || {
    name: "Alex Vance",
    email: "alex@skillhouse.ai",
    avatarUrl: "/figma/header_avatar_figma.png",
  };

  const categoriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleCtaClick = () => {
    const fn = onGetStarted || onOpenLoginModal || auth?.openLogin;
    fn?.();
  };

  const handleRequestSkillClick = () => {
    if (isSignedIn) {
      const fn = onRequestSkill || auth?.openRequestSkill;
      fn?.();
    } else {
      const fn = onOpenLoginModal || onGetStarted || auth?.openLogin;
      fn?.();
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation for dropdowns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCategoriesOpen(false);
        setUserMenuOpen(false);
      }
    };
    if (categoriesOpen || userMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [categoriesOpen, userMenuOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${responsiveMode === "tablet" ? styles.modeTablet : ""} ${responsiveMode === "mobile" ? styles.modeMobile : ""} ${className}`}>
      <motion.div
        className={styles.container}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={navVariants}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
      >
        {/* Brand Logo (Node 744:1064) */}
        <Link
          href="/"
          tabIndex={0}
          className={styles.brand}
          role="button"
          onClick={(e) => {
            if (onViewChange) {
              e.preventDefault();
              onViewChange("home");
            }
            setMobileMenuOpen(false);
          }}
          aria-label="Skillhouse Home"
        >
          <div className={styles.brandBadge}>
            <Image
              src="/figma/Logo black.svg"
              alt="Skillhouse Logo"
              width={38}
              height={40}
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Node 744:1077) */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          <button
            type="button"
            className={`${styles.navItem} ${currentView === "marketplace" ? styles.active : ""}`}
            onClick={() => onViewChange?.("marketplace")}
          >
            Skills
          </button>

          {/* Categories with Mega Menu Dropdown */}
          <div ref={categoriesRef} className={styles.categoriesContainer}>
            <button
              type="button"
              className={`${styles.navItem} ${categoriesOpen ? styles.active : ""}`}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
            >
              <span>Categories</span>
              <span
                className={`${styles.dropdownArrow} ${categoriesOpen ? styles.open : ""}`}
                aria-hidden="true"
              >
                <ChevronDown size={14} />
              </span>
            </button>

            {categoriesOpen && (
              <div className={styles.dropdownPositioner}>
                <CategoriesDropdown
                  onSelectCategory={(category: string) => {
                    setCategoriesOpen(false);
                    onSelectCategory?.(category);
                  }}
                  onSeeAllSkills={() => {
                    setCategoriesOpen(false);
                    onViewChange?.("marketplace");
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.navItem}
            onClick={() => {
              if (onOpenLoginModal) {
                onOpenLoginModal();
              } else if (onGetStarted) {
                onGetStarted();
              }
            }}
          >
            Pricing
          </button>
        </nav>

        {/* Right Actions Container */}
        <div className={styles.rightActions}>
          {/* Mobile Quick Search Button */}
          <button
            type="button"
            className={styles.mobileSearchButton}
            onClick={() => onOpenCommandPalette?.()}
            aria-label="Open command palette search"
          >
            <Search size={18} />
          </button>

          <div className={styles.searchWrapper}>
            <SearchInput
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onClear={() => onSearchChange?.("")}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
                  e.preventDefault();
                  onOpenCommandPalette?.();
                } else if (e.key === "Enter") {
                  onSearchSubmit?.(searchValue);
                }
              }}
              placeholder="Search skills / outputs"
            />
          </div>

          {onViewChange && (
            <button
              type="button"
              className={`${styles.docBadge} ${currentView === "design-system" ? styles.active : ""}`}
              onClick={() =>
                onViewChange(
                  currentView === "marketplace" ? "design-system" : "marketplace"
                )
              }
              title="Toggle between Marketplace view and Design System Documentation"
            >
              {currentView === "marketplace" ? "Design System" : "← Marketplace"}
            </button>
          )}

          {/* Request a skill icon (Figma Node 751:7770) - always visible whether logged in or not */}
          <button
            type="button"
            className={styles.headerSquareActionButton}
            aria-label="Request a skill"
            title="Request a skill"
            onClick={handleRequestSkillClick}
            data-testid="header-request-skill-action-btn"
          >
            <Image
              src="/figma/node_4621_371856.svg"
              alt="Request a skill"
              width={40}
              height={40}
              unoptimized
            />
          </button>

          {/* Signed In Avatar OR Logged Out Get Started Button */}
          {isSignedIn ? (
            <div ref={userMenuRef} className={styles.userMenuContainer}>
              {/* User Avatar with Online Dot + Chevron (Figma Node 4621:371883) */}
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User profile menu"
                data-testid="header-avatar-button"
              >
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarWrapper}>
                    <Image
                      src={user.avatarUrl || "/figma/header_avatar_figma.png"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className={styles.avatarImage}
                      unoptimized
                    />
                  </div>
                  <span className={styles.onlineIndicator} aria-hidden="true" />
                </div>
                <ChevronDown
                  size={18}
                  className={`${styles.avatarChevron} ${userMenuOpen ? styles.avatarChevronOpen : ""}`}
                  aria-hidden="true"
                />
              </button>

              {userMenuOpen && (
                <UserMenuPopover
                  variant="attending"
                  onMySkills={() => {
                    setUserMenuOpen(false);
                    onViewChange?.("my-skills");
                  }}
                  onBookmarks={() => {
                    setUserMenuOpen(false);
                    onViewChange?.("my-skills");
                  }}
                  onProfile={() => {
                    setUserMenuOpen(false);
                    const fn = onOpenProfile || (() => auth?.openProfile("profile"));
                    fn();
                  }}
                  onAccountSettings={() => {
                    setUserMenuOpen(false);
                    const fn = onOpenSettings || (() => auth?.openProfile("cli"));
                    fn();
                  }}
                  onHelpCenter={() => {
                    setUserMenuOpen(false);
                    const fn = onOpenHelpCenter || auth?.openHelpCenter;
                    fn?.();
                  }}
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={() => {
                    setUserMenuOpen(false);
                    const fn = onSignOut || auth?.logout;
                    fn?.();
                  }}
                />
              )}
            </div>
          ) : (
            <div className={styles.desktopCtaWrapper}>
              {/* Get Started Button (Figma Node 4621:371857 / 751:5945) */}
              <button
                type="button"
                className={styles.getStartedButton}
                onClick={handleCtaClick}
                data-testid="header-get-started-btn"
              >
                Get started
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={styles.mobileDrawer}
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <div className={styles.mobileDrawerLinks}>
            <button
              type="button"
              className={styles.mobileDrawerLink}
              onClick={() => {
                onViewChange?.("marketplace");
                setMobileMenuOpen(false);
              }}
            >
              <span>Skills Marketplace</span>
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className={styles.mobileDrawerLink}
              onClick={() => {
                onViewChange?.("my-skills");
                setMobileMenuOpen(false);
              }}
            >
              <span>My Skills Workspace</span>
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className={styles.mobileDrawerLink}
              onClick={() => {
                onViewChange?.("design-system");
                setMobileMenuOpen(false);
              }}
            >
              <span>Design System</span>
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className={styles.mobileDrawerLink}
              onClick={() => {
                handleRequestSkillClick();
                setMobileMenuOpen(false);
              }}
            >
              <span>Request a skill</span>
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              className={styles.mobileDrawerLink}
              onClick={() => {
                handleCtaClick();
                setMobileMenuOpen(false);
              }}
            >
              <span>Pricing</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.mobileDrawerActions}>
            {isSignedIn ? (
              <div className={styles.mobileSignedInBox}>
                <div className={styles.mobileUserRow}>
                  <Image
                    src={user.avatarUrl || "/figma/header_avatar_figma.png"}
                    alt={user.name}
                    width={36}
                    height={36}
                    className={styles.avatarImage}
                    unoptimized
                  />
                  <div>
                    <div className={styles.mobileUserName}>{user.name}</div>
                    <div className={styles.mobileUserEmail}>{user.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.mobileSignOutBtn}
                  onClick={() => {
                    if (onSignOut) onSignOut(); else if (auth?.logout) auth.logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <Button
                variant="brand"
                size="lg"
                onClick={() => {
                  handleCtaClick();
                  setMobileMenuOpen(false);
                }}
                style={{ width: "100%" }}
              >
                Get started
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
