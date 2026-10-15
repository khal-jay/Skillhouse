"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import styles from "./SkillBreadcrumbs.module.css";

export interface BreadcrumbCrumbItem {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

export interface SkillBreadcrumbsProps {
  /** Optional custom crumbs array to completely override default structure */
  crumbs?: BreadcrumbCrumbItem[];
  /** Category of the skill (e.g. "Presentations", "Code & Dev") */
  category?: string;
  /** Title of the current skill (e.g. "Visual Canvas Deck") */
  skillTitle?: string;
  /** Callback for back button click */
  onBack?: () => void;
  /** Callback for home navigation */
  onNavigateHome?: () => void;
  /** Callback for skills/marketplace navigation */
  onNavigateMarketplace?: () => void;
  /** Callback for category navigation */
  onNavigateCategory?: (category: string) => void;
  /** Additional custom className for the outer strip */
  className?: string;
}

export const SkillBreadcrumbs: React.FC<SkillBreadcrumbsProps> = ({
  crumbs,
  category = "Presentations",
  skillTitle = "Visual Canvas Deck",
  onBack,
  onNavigateHome,
  onNavigateMarketplace,
  onNavigateCategory,
  className = "",
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (onNavigateMarketplace) {
      onNavigateMarketplace();
    } else {
      router.back();
    }
  };

  // If custom crumbs are provided, render them; otherwise build default trail
  const items: BreadcrumbCrumbItem[] = crumbs ?? [
    {
      label: "Home",
      href: "/",
      icon: <Home size={14} className={styles.homeIcon} aria-hidden="true" />,
      onClick: (e) => {
        if (onNavigateHome) {
          e.preventDefault();
          onNavigateHome();
        }
      },
    },
    {
      label: "Skills",
      href: "/skills",
      onClick: (e) => {
        if (onNavigateMarketplace) {
          e.preventDefault();
          onNavigateMarketplace();
        }
      },
    },
    {
      label: category,
      href: `/skills?category=${encodeURIComponent(category)}`,
      onClick: (e) => {
        if (onNavigateCategory) {
          e.preventDefault();
          onNavigateCategory(category);
        } else if (onNavigateMarketplace) {
          e.preventDefault();
          onNavigateMarketplace();
        }
      },
    },
    {
      label: skillTitle,
      isCurrent: true,
    },
  ];

  return (
    <section
      className={`${styles.bar} ${className}`}
      aria-label="Breadcrumb navigation header"
      data-testid="skill-breadcrumbs-bar"
    >
      <div className={styles.inner}>
        <div className={styles.group}>
          {/* Back Action Button */}
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBackClick}
            aria-label="Back to skills marketplace"
            data-testid={onBack ? undefined : "skill-detail-back-btn"}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            <span>Back</span>
          </button>

          {/* Vertical Divider Line */}
          <span className={styles.divider} aria-hidden="true" />

          {/* Breadcrumb Navigation Trail */}
          <nav className={styles.nav} aria-label="Breadcrumb">
            <ol className={styles.list}>
              {items.map((crumb, idx) => {
                const isLast = idx === items.length - 1 || crumb.isCurrent;

                return (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    <li className={styles.item}>
                      {isLast ? (
                        <div className={styles.activePill}>
                          <span
                            role="link"
                            aria-disabled="true"
                            aria-current="page"
                          >
                            {crumb.label}
                          </span>
                        </div>
                      ) : crumb.href ? (
                        <Link
                          href={crumb.href}
                          className={styles.link}
                          onClick={crumb.onClick}
                          aria-label={crumb.label === "Home" ? "Home page" : crumb.label}
                        >
                          {crumb.icon}
                          <span>{crumb.label}</span>
                        </Link>
                      ) : (
                        <span
                          className={styles.link}
                          onClick={crumb.onClick}
                          role="button"
                          tabIndex={0}
                        >
                          {crumb.icon}
                          <span>{crumb.label}</span>
                        </span>
                      )}
                    </li>

                    {!isLast && (
                      <li
                        role="presentation"
                        aria-hidden="true"
                        className={styles.separator}
                      >
                        /
                      </li>
                    )}
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};
