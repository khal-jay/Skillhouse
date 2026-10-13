"use client";

import React, { useRef, useEffect } from "react";
import styles from "./UserMenuPopover.module.css";

import {
  ReceiptText,
  CircleUser,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

export interface UserMenuPopoverProps {
  variant?: "attending" | "extended";
  activeItem?: "my-skills" | "bookmarks" | "directory-history" | "profile" | "settings" | "help" | string;
  onMySkills?: () => void;
  onBookmarks?: () => void;
  onDirectoryHistory?: () => void;
  onProfile?: () => void;
  onAccountSettings?: () => void;
  onHelpCenter?: () => void;
  onSwitchHost?: () => void;
  onSwitchServiceProvider?: () => void;
  onMyListings?: () => void;
  onLogout?: () => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const UserMenuPopover: React.FC<UserMenuPopoverProps> = ({
  variant = "attending",
  activeItem,
  onMySkills,
  onBookmarks,
  onDirectoryHistory,
  onProfile,
  onAccountSettings,
  onHelpCenter,
  onLogout,
  onClose,
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Keyboard navigation across menu items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const validButtons = itemsRef.current.filter(
      (btn): btn is HTMLButtonElement => btn !== null && !btn.disabled
    );
    if (!validButtons.length) return;

    const currentIndex = validButtons.findIndex(
      (btn) => btn === document.activeElement
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (currentIndex === -1 || currentIndex === validButtons.length - 1) {
          validButtons[0].focus();
        } else {
          validButtons[currentIndex + 1].focus();
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (currentIndex <= 0) {
          validButtons[validButtons.length - 1].focus();
        } else {
          validButtons[currentIndex - 1].focus();
        }
        break;

      case "Home":
        e.preventDefault();
        validButtons[0].focus();
        break;

      case "End":
        e.preventDefault();
        validButtons[validButtons.length - 1].focus();
        break;

      case "Escape":
        e.preventDefault();
        onClose?.();
        break;

      default:
        break;
    }
  };

  const handleMySkillsClick = () => {
    if (onMySkills) {
      onMySkills();
    } else if (onBookmarks) {
      onBookmarks();
    } else if (onDirectoryHistory) {
      onDirectoryHistory();
    }
  };

  const registerItem = (el: HTMLButtonElement | null) => {
    if (el) {
      if (!itemsRef.current.includes(el)) {
        itemsRef.current.push(el);
      }
    }
  };

  const mySkillsLabel =
    variant === "extended" && onDirectoryHistory && !onMySkills && !onBookmarks
      ? "Directory history"
      : "My Skills";

  return (
    <div
      ref={containerRef}
      className={`${styles.popoverContainer} ${className}`}
      style={style}
      role="menu"
      aria-label="User Account Menu"
      data-testid="user-menu-popover"
      data-variant={variant}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.menuBody}>
        {/* Section 1: My Skills & Profile (Figma Node 4626:379155) */}
        <div className={styles.menuGroup} role="group" aria-label="Personal items">
          <button
            ref={registerItem}
            type="button"
            className={`${styles.menuItem} ${
              activeItem === "my-skills" || activeItem === "bookmarks" || activeItem === "directory-history"
                ? styles.activeItem
                : ""
            }`}
            role="menuitem"
            tabIndex={0}
            onClick={handleMySkillsClick}
            data-testid="user-menu-item-my-skills"
            aria-label={mySkillsLabel}
          >
            <ReceiptText size={18} strokeWidth={1.5} className={styles.itemIcon} aria-hidden="true" />
            <span className={styles.itemLabel}>{mySkillsLabel}</span>
          </button>

          <button
            ref={registerItem}
            type="button"
            className={`${styles.menuItem} ${
              activeItem === "profile" ? styles.activeItem : ""
            }`}
            role="menuitem"
            tabIndex={0}
            onClick={onProfile}
            data-testid="user-menu-item-profile"
            aria-label="Profile"
          >
            <CircleUser size={18} strokeWidth={1.5} className={styles.itemIcon} aria-hidden="true" />
            <span className={styles.itemLabel}>Profile</span>
          </button>
        </div>

        {/* Divider 1 */}
        <hr className={styles.divider} aria-hidden="true" />

        {/* Section 2: Account settings & Help center (Figma Node 4626:379155) */}
        <div className={styles.menuGroup} role="group" aria-label="Preferences and Help">
          <button
            ref={registerItem}
            type="button"
            className={`${styles.menuItem} ${
              activeItem === "settings" ? styles.activeItem : ""
            }`}
            role="menuitem"
            tabIndex={0}
            onClick={onAccountSettings}
            data-testid="user-menu-item-settings"
            aria-label="Account settings"
          >
            <Settings size={18} strokeWidth={1.5} className={styles.itemIcon} aria-hidden="true" />
            <span className={styles.itemLabel}>Account settings</span>
          </button>

          <button
            ref={registerItem}
            type="button"
            className={`${styles.menuItem} ${
              activeItem === "help" ? styles.activeItem : ""
            }`}
            role="menuitem"
            tabIndex={0}
            onClick={onHelpCenter}
            data-testid="user-menu-item-help"
            aria-label="Help center"
          >
            <CircleHelp size={18} strokeWidth={1.5} className={styles.itemIcon} aria-hidden="true" />
            <span className={styles.itemLabel}>Help center</span>
          </button>
        </div>

        {/* Divider 2 */}
        <hr className={styles.divider} aria-hidden="true" />

        {/* Section 3: Logout (Figma Node 4626:379155) */}
        <div className={styles.menuGroup} role="group" aria-label="Session">
          <button
            ref={registerItem}
            type="button"
            className={`${styles.menuItem} ${styles.logoutItem}`}
            role="menuitem"
            tabIndex={0}
            onClick={onLogout}
            data-testid="user-menu-item-logout"
            aria-label="Logout"
          >
            <LogOut size={18} strokeWidth={1.5} className={styles.itemIcon} aria-hidden="true" />
            <span className={styles.itemLabel}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
