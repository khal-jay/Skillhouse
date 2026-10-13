"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY_BOOKMARKS = "skillhouse_saved_skills";
const STORAGE_KEY_INSTALLED = "skillhouse_installed_skills";
const WORKSPACE_CHANGE_EVENT = "skillhouse_workspace_change";

const EMPTY_ARRAY: string[] = [];

let cachedBookmarksRaw: string | null = null;
let cachedBookmarksParsed: string[] = EMPTY_ARRAY;

let cachedInstalledRaw: string | null = null;
let cachedInstalledParsed: string[] = EMPTY_ARRAY;

function subscribeWorkspace(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(WORKSPACE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WORKSPACE_CHANGE_EVENT, callback);
  };
}

function getBookmarksSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (raw === cachedBookmarksRaw) return cachedBookmarksParsed;
    cachedBookmarksRaw = raw;
    if (!raw) {
      cachedBookmarksParsed = EMPTY_ARRAY;
    } else {
      const parsed = JSON.parse(raw);
      cachedBookmarksParsed = Array.isArray(parsed) ? parsed : EMPTY_ARRAY;
    }
    return cachedBookmarksParsed;
  } catch {
    cachedBookmarksParsed = EMPTY_ARRAY;
    return EMPTY_ARRAY;
  }
}

function getInstalledSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_INSTALLED);
    if (raw === cachedInstalledRaw) return cachedInstalledParsed;
    cachedInstalledRaw = raw;
    if (!raw) {
      cachedInstalledParsed = EMPTY_ARRAY;
    } else {
      const parsed = JSON.parse(raw);
      cachedInstalledParsed = Array.isArray(parsed) ? parsed : EMPTY_ARRAY;
    }
    return cachedInstalledParsed;
  } catch {
    cachedInstalledParsed = EMPTY_ARRAY;
    return EMPTY_ARRAY;
  }
}

export function getServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

export function useAppWorkspace() {
  const savedSkillIds = useSyncExternalStore(
    subscribeWorkspace,
    getBookmarksSnapshot,
    getServerSnapshot
  );

  const installedSkillIds = useSyncExternalStore(
    subscribeWorkspace,
    getInstalledSnapshot,
    getServerSnapshot
  );

  const isLoaded = true;

  // Save to localStorage when bookmarks change
  const toggleBookmark = useCallback((skillId: string) => {
    const exists = savedSkillIds.includes(skillId);
    const next = exists ? savedSkillIds.filter((id) => id !== skillId) : [...savedSkillIds, skillId];
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(next));
        window.dispatchEvent(new Event(WORKSPACE_CHANGE_EVENT));
      }
    } catch {
      // Ignore quota/private browsing errors
    }
    return next;
  }, [savedSkillIds]);

  // Save to localStorage when installed skills change
  const toggleInstall = useCallback((skillId: string) => {
    const exists = installedSkillIds.includes(skillId);
    const next = exists ? installedSkillIds.filter((id) => id !== skillId) : [...installedSkillIds, skillId];
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY_INSTALLED, JSON.stringify(next));
        window.dispatchEvent(new Event(WORKSPACE_CHANGE_EVENT));
      }
    } catch {
      // Ignore quota/private browsing errors
    }
    return next;
  }, [installedSkillIds]);

  const isBookmarked = useCallback(
    (skillId: string) => savedSkillIds.includes(skillId),
    [savedSkillIds]
  );

  const isInstalled = useCallback(
    (skillId: string) => installedSkillIds.includes(skillId),
    [installedSkillIds]
  );

  return {
    savedSkillIds,
    installedSkillIds,
    toggleBookmark,
    toggleInstall,
    isBookmarked,
    isInstalled,
    isLoaded,
  };
}
