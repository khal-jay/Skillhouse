import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MySkillsWorkspace } from "./MySkillsWorkspace";

describe("MySkillsWorkspace Component", () => {
  it("renders empty state when no saved skills exist (Figma Node 4687:201493)", () => {
    const handleMarketplace = vi.fn();
    const handleRequestSkill = vi.fn();
    render(
      <MySkillsWorkspace
        savedSkillIds={[]}
        installedSkillIds={[]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={handleMarketplace}
        onRequestSkill={handleRequestSkill}
      />
    );

    expect(screen.getByTestId("workspace-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No saved skills yet")).toBeInTheDocument();
    expect(screen.getByText(/Save your favorite AI agent workflows/i)).toBeInTheDocument();

    const exploreBtn = screen.getByTestId("empty-state-explore-btn");
    fireEvent.click(exploreBtn);
    expect(handleMarketplace).toHaveBeenCalledTimes(1);

    const requestBtn = screen.getByTestId("empty-state-request-btn");
    fireEvent.click(requestBtn);
    expect(handleRequestSkill).toHaveBeenCalledTimes(1);
  });

  it("renders skills grid when saved skills are present and toggles tabs (Figma Node 4687:203867)", () => {
    const handleSelectSkill = vi.fn();
    const handleToggleBookmark = vi.fn();
    const handleToggleInstall = vi.fn();
    const handleOpenCommandPalette = vi.fn();
    const handleNavigateHome = vi.fn();
    const handleNavigateDesignSystem = vi.fn();

    render(
      <MySkillsWorkspace
        savedSkillIds={["visual-canvas-deck"]}
        installedSkillIds={["pixel-promo-video"]}
        onToggleBookmark={handleToggleBookmark}
        onToggleInstall={handleToggleInstall}
        onNavigateHome={handleNavigateHome}
        onNavigateMarketplace={vi.fn()}
        onNavigateDesignSystem={handleNavigateDesignSystem}
        onSelectSkillDetail={handleSelectSkill}
        onOpenCommandPalette={handleOpenCommandPalette}
      />
    );

    // Initial saved tab
    expect(screen.getByTestId("workspace-skills-grid")).toBeInTheDocument();
    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();

    // Click quick search button
    const searchBtn = screen.getByRole("button", { name: /search all skills with command palette/i });
    fireEvent.click(searchBtn);
    expect(handleOpenCommandPalette).toHaveBeenCalled();

    // Click skill card -> opens drawer (Figma Node 4687:205241)
    const skillCard = screen.getByText("Visual Canvas Deck");
    fireEvent.click(skillCard);
    expect(handleSelectSkill).toHaveBeenCalledWith("visual-canvas-deck");
    expect(screen.getByTestId("skill-detail-drawer")).toBeInTheDocument();

    // Close drawer
    const closeDrawerBtn = screen.getByRole("button", { name: /close drawer/i });
    fireEvent.click(closeDrawerBtn);

    // Click bookmark button on card in saved tab
    const bookmarkBtns = screen.getAllByRole("button", { name: /remove from saved skills|save skill to bookmarks/i });
    if (bookmarkBtns.length > 0) {
      fireEvent.click(bookmarkBtns[0]);
      expect(handleToggleBookmark).toHaveBeenCalledWith("visual-canvas-deck");
    }

    // Switch to installed tab
    const installedTab = screen.getByTestId("tab-installed-skills");
    fireEvent.click(installedTab);
    expect(screen.getByText("Pixel Promo Video")).toBeInTheDocument();

    // Click bookmark/install button in installed tab
    const installActionBtns = screen.getAllByRole("button", { name: /remove from saved skills|save skill to bookmarks/i });
    if (installActionBtns.length > 0) {
      fireEvent.click(installActionBtns[0]);
      expect(handleToggleInstall).toHaveBeenCalledWith("pixel-promo-video");
    }
  });

  it("filters skills by text search and resets on no results", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={["visual-canvas-deck", "pixel-promo-video"]}
        installedSkillIds={[]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );

    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();
    expect(screen.getByText("Pixel Promo Video")).toBeInTheDocument();

    const filterInput = screen.getByTestId("workspace-filter-input");
    fireEvent.change(filterInput, { target: { value: "Visual" } });

    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();
    expect(screen.queryByText("Pixel Promo Video")).not.toBeInTheDocument();

    // Search query with no match
    fireEvent.change(filterInput, { target: { value: "NonExistentXYZ" } });
    expect(screen.getByTestId("no-search-results")).toBeInTheDocument();

    // Click reset button
    const resetBtn = screen.getByRole("button", { name: /reset search filters/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();
    expect(screen.getByText("Pixel Promo Video")).toBeInTheDocument();
  });

  it("renders empty state in installed tab when no tools are installed", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={["visual-canvas-deck"]}
        installedSkillIds={[]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );

    const installedTab = screen.getByTestId("tab-installed-skills");
    fireEvent.click(installedTab);
    expect(screen.getByText("No installed tools configured")).toBeInTheDocument();
  });

  it("renders personalized greeting when user is signed in", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={[]}
        installedSkillIds={[]}
        isSignedIn={true}
        user={{ name: "Alex Vance", email: "alex@skillhouse.ai" }}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );
    expect(screen.getByText("Alex Vance’s Workspace")).toBeInTheDocument();
  });
});
