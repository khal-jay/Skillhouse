"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NavBar } from "@/components/features/NavBar";
import { HeroSection } from "@/components/features/HeroSection";
import { ConnectAgentBanner } from "@/components/features/ConnectAgentBanner";
import { FaqSection } from "@/components/features/FaqSection";
import { MarketplaceView } from "@/components/features/MarketplaceView";
import { MySkillsWorkspace } from "@/components/features/MySkillsWorkspace/MySkillsWorkspace";
import { CommandPalette } from "@/components/features/CommandPalette/CommandPalette";
import { LoginModal } from "@/components/features/LoginModal";
import { RequestSkillModal } from "@/components/features/RequestSkillModal";
import { UserProfileModal, UserProfileData } from "@/components/features/UserProfileModal";
import { useAuthSafe } from "@/lib/AuthContext";
import { HelpCenterModal } from "@/components/features/HelpCenterModal";
import { Footer } from "@/components/features/Footer";
import { useAppWorkspace } from "@/lib/useAppWorkspace";
import styles from "./home-screen/page.module.css";

function MainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workspace = useAppWorkspace();

  const categoryParam = searchParams.get("category") || "";
  const viewParam = searchParams.get("view") || "";
  const searchParam = searchParams.get("search") || searchParams.get("q") || "";
  const loadingParam = searchParams.get("loading");

  const [activeViewOverride, setActiveViewOverride] = useState<
    "home" | "marketplace" | "my-skills" | null
  >(null);
  const [selectedCategoryOverride, setSelectedCategoryOverride] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const activeView =
    activeViewOverride ??
    (viewParam === "marketplace" || Boolean(categoryParam) || Boolean(searchParam)
      ? "marketplace"
      : viewParam === "my-skills"
      ? "my-skills"
      : "home");

  const selectedCategory = selectedCategoryOverride ?? categoryParam;

  const auth = useAuthSafe();
  const [localLoginOpen, setLocalLoginOpen] = useState(false);
  const isLoginOpen = auth ? auth.isLoginOpen : localLoginOpen;
  const setIsLoginOpen = (val: boolean) => {
    if (auth) {
      if (val) auth.openLogin();
      else auth.closeLogin();
    } else {
      setLocalLoginOpen(val);
    }
  };

  const [localRequestSkillOpen, setLocalRequestSkillOpen] = useState(false);
  const isRequestSkillOpen = auth ? auth.isRequestSkillOpen : localRequestSkillOpen;
  const setIsRequestSkillOpen = (val: boolean) => {
    if (auth) {
      if (val) auth.openRequestSkill();
      else auth.closeRequestSkill();
    } else {
      setLocalRequestSkillOpen(val);
    }
  };

  const [requestSkillPrefill, setRequestSkillPrefill] = useState<string | undefined>(undefined);

  const [localUser, setLocalUser] = useState<UserProfileData | null>(null);
  const user = auth ? auth.user : localUser;

  const [localProfileOpen, setLocalProfileOpen] = useState(false);
  const isProfileOpen = auth ? auth.isProfileOpen : localProfileOpen;
  const setIsProfileOpen = (val: boolean) => {
    if (auth) {
      if (val) auth.openProfile();
      else auth.closeProfile();
    } else {
      setLocalProfileOpen(val);
    }
  };

  const [localProfileInitialTab, setLocalProfileInitialTab] = useState<"profile" | "cli" | "settings">("profile");
  const profileInitialTab = auth ? (auth.profileTab as "profile" | "cli" | "settings") : localProfileInitialTab;
  const setProfileInitialTab = (tab: "profile" | "cli" | "settings") => {
    if (auth) auth.openProfile(tab);
    else setLocalProfileInitialTab(tab);
  };

  const [localHelpCenterOpen, setLocalHelpCenterOpen] = useState(false);
  const isHelpCenterOpen = auth ? auth.isHelpCenterOpen : localHelpCenterOpen;
  const setIsHelpCenterOpen = (val: boolean) => {
    if (auth) {
      if (val) auth.openHelpCenter();
      else auth.closeHelpCenter();
    } else {
      setLocalHelpCenterOpen(val);
    }
  };

  const handleLogin = (provider: "google" | "github") => {
    if (auth) {
      auth.login(provider);
      return;
    }
    const loggedInUser: UserProfileData = {
      name: "Alex Vance",
      email: provider === "github" ? "alex.vance@github.com" : "alex.vance@skillhouse.ai",
      avatarUrl: "/figma/header_avatar_figma.png",
      provider,
      role: "Verified Developer",
      apiKey: "sk_live_9f82d1c47a38910b",
    };
    setLocalUser(loggedInUser);
    try {
      localStorage.setItem("skillhouse_user", JSON.stringify(loggedInUser));
    } catch {
      // Storage unavailable
    }
    setLocalLoginOpen(false);
  };

  const handleSignOut = () => {
    if (auth) {
      auth.logout();
      return;
    }
    setLocalUser(null);
    try {
      localStorage.removeItem("skillhouse_user");
    } catch {
      // Storage unavailable
    }
  };

  const handleOpenProfile = () => {
    setProfileInitialTab("profile");
    setIsProfileOpen(true);
  };

  const handleOpenSettings = () => {
    setProfileInitialTab("settings");
    setIsProfileOpen(true);
  };

  const handleOpenHelpCenter = () => {
    setIsHelpCenterOpen(true);
  };


  // Sync state if browser back/forward button is pressed
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category") || "";
      const view = params.get("view") || "";
      const q = params.get("search") || params.get("q") || "";

      if (view === "marketplace" || Boolean(cat) || Boolean(q)) {
        setActiveViewOverride("marketplace");
        setSelectedCategoryOverride(cat);
        setSearchValue(q);
      } else if (view === "my-skills") {
        setActiveViewOverride("my-skills");
        setSelectedCategoryOverride("");
        setSearchValue("");
      } else {
        setActiveViewOverride("home");
        setSelectedCategoryOverride("");
        setSearchValue("");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut listener for webapp command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateToMarketplace = useCallback((category?: string, search?: string) => {
    const targetCategory = category !== undefined ? category : "";
    const targetSearch = search !== undefined ? search : "";

    setSelectedCategoryOverride(targetCategory);
    if (search !== undefined) setSearchValue(targetSearch);
    setActiveViewOverride("marketplace");

    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      params.set("view", "marketplace");
      if (targetCategory) params.set("category", targetCategory);
      if (targetSearch) params.set("search", targetSearch);
      window.history.pushState(null, "", `/?${params.toString()}`);
    }
  }, []);

  const navigateToMySkills = useCallback(() => {
    setActiveViewOverride("my-skills");
    setSelectedCategoryOverride("");
    setSearchValue("");

    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      params.set("view", "my-skills");
      window.history.pushState(null, "", `/?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const navigateHome = useCallback(() => {
    setActiveViewOverride("home");
    setSelectedCategoryOverride("");
    setSearchValue("");

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Shared Modals
  const sharedDrawersAndModals = (
    <>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateView={(view) => {
          if (view === "home") navigateHome();
          else if (view === "marketplace") navigateToMarketplace();
          else if (view === "my-skills") navigateToMySkills();
          else if (view === "design-system") router.push("/design-system");
        }}
        onConnectAgent={() => {
          if (activeView !== "home") {
            navigateHome();
          }
          setTimeout(() => {
            const banner = document.getElementById("connect-agent-banner");
            banner?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 120);
        }}
        onSelectSkill={(id) => router.push(`/skills/${id}`)}
        onRequestSkill={(prefill) => {
          setRequestSkillPrefill(prefill);
          setIsRequestSkillOpen(true);
        }}
        savedSkillIds={workspace.savedSkillIds}
        installedSkillIds={workspace.installedSkillIds}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSignOut={handleSignOut}
        initialTab={profileInitialTab}
      />

      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
        onRequestSkill={() => setIsRequestSkillOpen(true)}
      />

      <RequestSkillModal
        isOpen={isRequestSkillOpen}
        onClose={() => {
          setIsRequestSkillOpen(false);
          setRequestSkillPrefill(undefined);
        }}
        initialTitle={requestSkillPrefill}
        onSubmitSuccess={() => {
          setIsRequestSkillOpen(false);
          setRequestSkillPrefill(undefined);
        }}
      />
    </>
  );

  // When activeView is my-skills, render the user's workspace
  if (activeView === "my-skills") {
    return (
      <>
        <MySkillsWorkspace
          savedSkillIds={workspace.savedSkillIds}
          installedSkillIds={workspace.installedSkillIds}
          onToggleBookmark={workspace.toggleBookmark}
          onToggleInstall={workspace.toggleInstall}
          onNavigateHome={navigateHome}
          onNavigateMarketplace={() => navigateToMarketplace()}
          onNavigateDesignSystem={() => router.push("/design-system")}
          onSelectSkillDetail={(id) => router.push(`/skills/${id}`)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onRequestSkill={() => setIsRequestSkillOpen(true)}
          onOpenLoginModal={() => setIsLoginOpen(true)}
          isSignedIn={Boolean(user)}
          user={user}
          onSignOut={handleSignOut}
          onOpenProfile={handleOpenProfile}
          onOpenSettings={handleOpenSettings}
          onOpenHelpCenter={handleOpenHelpCenter}
        />
        {sharedDrawersAndModals}
      </>
    );
  }

  // When activeView is marketplace, render the full Agent Skills Marketplace (Figma Node 751:4572)
  if (activeView === "marketplace") {
    return (
      <>
        <MarketplaceView
          isLoading={loadingParam === "true" || loadingParam === "1" ? true : undefined}
          initialCategory={selectedCategory}
          initialSearch={searchValue}
          onNavigateHome={navigateHome}
          onNavigateMySkills={navigateToMySkills}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          savedSkillsCount={workspace.savedSkillIds.length}
          onSelectSkillDetail={(id) => router.push(`/skills/${id}`)}
          isSignedIn={Boolean(user)}
          user={user}
          onOpenLoginModal={() => setIsLoginOpen(true)}
          onSignOut={handleSignOut}
          onOpenProfile={handleOpenProfile}
          onOpenSettings={handleOpenSettings}
          onOpenHelpCenter={handleOpenHelpCenter}
        />
        {sharedDrawersAndModals}
      </>
    );
  }

  // Otherwise render the Discovery Home Screen (Figma Node 751:4774) with Hero & Joined Category Grid
  return (
    <div className={styles.pageContainer} data-testid="home-screen-page">
      {/* 1. Sticky Navigation Bar */}
      <NavBar
        currentView="home"
        onViewChange={(view) => {
          if (view === "marketplace") {
            navigateToMarketplace();
          } else if (view === "my-skills") {
            navigateToMySkills();
          } else if (view === "design-system") {
            router.push("/design-system");
          } else {
            navigateHome();
          }
        }}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={(val) => {
          if (val.trim()) {
            navigateToMarketplace(undefined, val.trim());
          }
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onSelectCategory={(category: string) => {
          navigateToMarketplace(category);
        }}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onRequestSkill={() => setIsRequestSkillOpen(true)}
        onGetStarted={() => setIsLoginOpen(true)}
        isSignedIn={Boolean(user)}
        user={user || undefined}
        onSignOut={handleSignOut}
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
        onOpenHelpCenter={handleOpenHelpCenter}
        savedSkillsCount={workspace.savedSkillIds.length}
      />

      <main className={styles.mainContent}>
        {/* 2. Hero Section with Joined Discovery Matrix & Works With */}
        <HeroSection
          onSeeAllSkills={() => {
            navigateToMarketplace();
          }}
          onSubmitSkill={() => setIsRequestSkillOpen(true)}
          onSelectCategory={(cat) => {
            navigateToMarketplace(cat.id || cat.title);
          }}
        />

        {/* 3. Connect Your Agent Interactive Terminal Banner */}
        <section id="connect-agent-banner" className={styles.bannerSection} aria-label="Connect Your Agent Section">
          <ConnectAgentBanner />
        </section>

        {/* 4. Frequently Asked Questions (Figma Node 851:3373) */}
        <FaqSection />
      </main>

      {/* 4. Global Dark Footer */}
      <Footer
        onSelectCategory={(cat) => {
          navigateToMarketplace(cat);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateMarketplace={() => {
          navigateToMarketplace();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {sharedDrawersAndModals}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#FFEEDD" }} />}>
      <MainContent />
    </Suspense>
  );
}
