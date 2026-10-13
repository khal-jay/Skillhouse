"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { UserProfileData } from "@/components/features/UserProfileModal";
import { LoginModal } from "@/components/features/LoginModal";
import { UserProfileModal } from "@/components/features/UserProfileModal";
import { HelpCenterModal } from "@/components/features/HelpCenterModal";
import { RequestSkillModal } from "@/components/features/RequestSkillModal";

export const STORAGE_KEY_AUTH_USER = "skillhouse_user";
export const AUTH_CHANGE_EVENT = "skillhouse_auth_change";

export const DEFAULT_MOCK_USER: UserProfileData = {
  name: "Alex Vance",
  email: "alex@acme.dev",
  avatarUrl: "/figma/header_avatar_figma.png",
  role: "Principal AI Engineer",
  provider: "google",
  apiKey: "sk-live-sh-98f23c7b1a0e",
};

export interface AuthContextType {
  user: UserProfileData | null;
  isSignedIn: boolean;
  login: (provider?: "google" | "github") => void;
  logout: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  isProfileOpen: boolean;
  profileTab: "profile" | "cli" | "settings";
  openProfile: (tab?: "profile" | "cli" | "settings") => void;
  closeProfile: () => void;
  isHelpCenterOpen: boolean;
  openHelpCenter: () => void;
  closeHelpCenter: () => void;
  isRequestSkillOpen: boolean;
  openRequestSkill: () => void;
  closeRequestSkill: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

let cachedUserRaw: string | null = null;
let cachedUserParsed: UserProfileData | null = null;

export function subscribeAuth(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

export function getAuthSnapshot(): UserProfileData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (raw === cachedUserRaw) return cachedUserParsed;
    cachedUserRaw = raw;
    cachedUserParsed = raw ? JSON.parse(raw) : null;
    return cachedUserParsed;
  } catch {
    return null;
  }
}

export function getServerAuthSnapshot(): UserProfileData | null {
  return null;
}

export function AuthModals() {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  return (
    <>
      <LoginModal
        isOpen={auth.isLoginOpen}
        onClose={auth.closeLogin}
        onLogin={(provider) => auth.login(provider)}
      />
      <UserProfileModal
        isOpen={auth.isProfileOpen}
        onClose={auth.closeProfile}
        user={auth.user}
        initialTab={auth.profileTab}
        onSignOut={auth.logout}
      />
      <HelpCenterModal
        isOpen={auth.isHelpCenterOpen}
        onClose={auth.closeHelpCenter}
        onRequestSkill={() => {
          auth.closeHelpCenter();
          auth.openRequestSkill();
        }}
      />
      <RequestSkillModal
        isOpen={auth.isRequestSkillOpen}
        onClose={auth.closeRequestSkill}
        onSubmitSuccess={auth.closeRequestSkill}
      />
    </>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<"profile" | "cli" | "settings">("profile");
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isRequestSkillOpen, setIsRequestSkillOpen] = useState(false);

  const login = useCallback((provider: "google" | "github" = "google") => {
    const newUser: UserProfileData = {
      name: "Alex Vance",
      email: provider === "github" ? "alex.vance@github.com" : "alex@acme.dev",
      avatarUrl: "/figma/header_avatar_figma.png",
      role: "Principal AI Engineer",
      provider,
      apiKey: "sk-live-sh-98f23c7b1a0e",
    };

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(newUser));
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      }
    } catch {
      // Ignore
    }
    setIsLoginOpen(false);
  }, []);

  const logout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY_AUTH_USER);
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
      }
    } catch {
      // Ignore
    }
    setIsProfileOpen(false);
    setIsHelpCenterOpen(false);
  }, []);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const openProfile = useCallback((tab: "profile" | "cli" | "settings" = "profile") => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  }, []);
  const closeProfile = useCallback(() => setIsProfileOpen(false), []);

  const openHelpCenter = useCallback(() => setIsHelpCenterOpen(true), []);
  const closeHelpCenter = useCallback(() => setIsHelpCenterOpen(false), []);

  const openRequestSkill = useCallback(() => setIsRequestSkillOpen(true), []);
  const closeRequestSkill = useCallback(() => setIsRequestSkillOpen(false), []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isSignedIn: Boolean(user),
      login,
      logout,
      isLoginOpen,
      openLogin,
      closeLogin,
      isProfileOpen,
      profileTab,
      openProfile,
      closeProfile,
      isHelpCenterOpen,
      openHelpCenter,
      closeHelpCenter,
      isRequestSkillOpen,
      openRequestSkill,
      closeRequestSkill,
    }),
    [
      user,
      login,
      logout,
      isLoginOpen,
      openLogin,
      closeLogin,
      isProfileOpen,
      profileTab,
      openProfile,
      closeProfile,
      isHelpCenterOpen,
      openHelpCenter,
      closeHelpCenter,
      isRequestSkillOpen,
      openRequestSkill,
      closeRequestSkill,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModals />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthSafe(): AuthContextType | null {
  return useContext(AuthContext);
}
