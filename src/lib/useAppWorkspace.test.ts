import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppWorkspace, getServerSnapshot } from "./useAppWorkspace";

describe("useAppWorkspace Hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty array from getServerSnapshot for SSR hydration matching", () => {
    expect(getServerSnapshot()).toEqual([]);
  });

  it("initializes empty and toggles bookmarks with localStorage persistence", () => {
    const { result } = renderHook(() => useAppWorkspace());

    expect(result.current.savedSkillIds).toEqual([]);
    expect(result.current.isBookmarked("visual-canvas-deck")).toBe(false);

    // Toggle bookmark on
    act(() => {
      result.current.toggleBookmark("visual-canvas-deck");
    });

    expect(result.current.savedSkillIds).toContain("visual-canvas-deck");
    expect(result.current.isBookmarked("visual-canvas-deck")).toBe(true);
    expect(
      JSON.parse(window.localStorage.getItem("skillhouse_saved_skills") || "[]")
    ).toContain("visual-canvas-deck");

    // Toggle bookmark off
    act(() => {
      result.current.toggleBookmark("visual-canvas-deck");
    });

    expect(result.current.savedSkillIds).not.toContain("visual-canvas-deck");
    expect(result.current.isBookmarked("visual-canvas-deck")).toBe(false);
  });

  it("toggles skill install state with persistence and uninstalls when clicked again", () => {
    const { result } = renderHook(() => useAppWorkspace());

    expect(result.current.isInstalled("pixel-promo-video")).toBe(false);

    act(() => {
      result.current.toggleInstall("pixel-promo-video");
    });

    expect(result.current.isInstalled("pixel-promo-video")).toBe(true);
    expect(result.current.installedSkillIds).toContain("pixel-promo-video");

    act(() => {
      result.current.toggleInstall("pixel-promo-video");
    });
    expect(result.current.isInstalled("pixel-promo-video")).toBe(false);
  });

  it("initializes with existing saved and installed skills from localStorage", () => {
    window.localStorage.setItem("skillhouse_saved_skills", JSON.stringify(["saved-1"]));
    window.localStorage.setItem("skillhouse_installed_skills", JSON.stringify(["inst-1"]));

    const { result } = renderHook(() => useAppWorkspace());

    expect(result.current.savedSkillIds).toEqual(["saved-1"]);
    expect(result.current.installedSkillIds).toEqual(["inst-1"]);
    expect(result.current.isBookmarked("saved-1")).toBe(true);
    expect(result.current.isInstalled("inst-1")).toBe(true);
  });

  it("handles corrupted localStorage JSON gracefully without throwing", () => {
    window.localStorage.setItem("skillhouse_saved_skills", "invalid-json");
    window.localStorage.setItem("skillhouse_installed_skills", "invalid-json");

    const { result } = renderHook(() => useAppWorkspace());
    expect(result.current.savedSkillIds).toEqual([]);
    expect(result.current.installedSkillIds).toEqual([]);
  });
});
