import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MySkillsWorkspace } from "./MySkillsWorkspace";

describe("MySkillsWorkspace Component (Figma Nodes 886:22434, 886:26345, 886:22604, 886:22774)", () => {
  it("renders Bookmark empty state when no saved skills exist (Figma Node 886:22434)", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={[]}
        installedSkillIds={[]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );

    // Page Title
    expect(screen.getByRole("heading", { level: 1, name: "My Skills" })).toBeInTheDocument();

    // Tabs
    expect(screen.getByTestId("tab-saved-skills")).toBeInTheDocument();
    expect(screen.getByTestId("tab-installed-skills")).toBeInTheDocument();

    // Empty state 898:10686
    expect(screen.getByTestId("workspace-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No bookmarks found")).toBeInTheDocument();
    expect(screen.getByText("You have no skill bookmarked at this time")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-empty-bookmark-cta")).toHaveTextContent("Bookmark skill");
  });

  it("renders Bookmark filled grid view when saved skills exist (Figma Node 886:26345)", () => {
    const handleSelectSkill = vi.fn();
    const handleToggleBookmark = vi.fn();

    render(
      <MySkillsWorkspace
        savedSkillIds={["visual-canvas-deck"]}
        installedSkillIds={[]}
        onToggleBookmark={handleToggleBookmark}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
        onSelectSkillDetail={handleSelectSkill}
      />
    );

    // Grid container
    expect(screen.getByTestId("workspace-skills-grid")).toBeInTheDocument();
    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();

    // Click skill card -> opens drawer
    const skillCard = screen.getByText("Visual Canvas Deck");
    fireEvent.click(skillCard);
    expect(handleSelectSkill).toHaveBeenCalledWith("visual-canvas-deck");
    expect(screen.getByTestId("skill-detail-drawer")).toBeInTheDocument();
  });

  it("renders Installed empty state when no installed skills exist (Figma Node 886:22604)", () => {
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

    // Switch to Installed tab
    const installedTab = screen.getByTestId("tab-installed-skills");
    fireEvent.click(installedTab);

    // Empty state 898:10709
    expect(screen.getByTestId("workspace-installed-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No installed skill found")).toBeInTheDocument();
    expect(screen.getByText("You have no skill installed at this time")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-empty-install-cta")).toHaveTextContent("Install a skill");
  });

  it("renders Installed filled table view with pagination when installed skills exist (Figma Node 886:22774)", () => {
    const handleSelectSkill = vi.fn();

    render(
      <MySkillsWorkspace
        savedSkillIds={[]}
        installedSkillIds={["pixel-promo-video"]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
        onSelectSkillDetail={handleSelectSkill}
      />
    );

    // Switch to Installed tab
    const installedTab = screen.getByTestId("tab-installed-skills");
    fireEvent.click(installedTab);

    // Table container
    expect(screen.getByTestId("workspace-installed-table")).toBeInTheDocument();
    expect(screen.getByText("Skill name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Latest update")).toBeInTheDocument();
    expect(screen.getByText("Pixel Promo Video")).toBeInTheDocument();

    // Click table row opens detail drawer
    const row = screen.getByTestId("installed-row-pixel-promo-video");
    fireEvent.click(row);
    expect(handleSelectSkill).toHaveBeenCalledWith("pixel-promo-video");
    expect(screen.getByTestId("skill-detail-drawer")).toBeInTheDocument();
  });

  it("filters skills by search input in both tabs", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={["visual-canvas-deck", "pixel-promo-video"]}
        installedSkillIds={["pixel-promo-video"]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );

    const filterInput = screen.getByTestId("workspace-filter-input");
    fireEvent.change(filterInput, { target: { value: "Visual" } });

    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();
    expect(screen.queryByText("Pixel Promo Video")).not.toBeInTheDocument();

    // Search query with no match
    fireEvent.change(filterInput, { target: { value: "NonExistentXYZ" } });
    expect(screen.getByTestId("no-search-results")).toBeInTheDocument();

    // Reset button
    const resetBtn = screen.getByRole("button", { name: /reset search filters/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText("Visual Canvas Deck")).toBeInTheDocument();
  });
  it("supports sorting and installing updates in installed table (Figma Node 886:22807)", () => {
    render(
      <MySkillsWorkspace
        savedSkillIds={[]}
        installedSkillIds={["visual-canvas-deck", "pixel-promo-video", "web-dev-pro"]}
        onToggleBookmark={vi.fn()}
        onToggleInstall={vi.fn()}
        onNavigateHome={vi.fn()}
        onNavigateMarketplace={vi.fn()}
      />
    );

    // Switch to Installed tab
    fireEvent.click(screen.getByTestId("tab-installed-skills"));

    // Sort buttons exist
    const categorySortBtn = screen.getByRole("button", { name: /sort by category/i });
    expect(categorySortBtn).toBeInTheDocument();
    fireEvent.click(categorySortBtn);

    const updateSortBtn = screen.getByRole("button", { name: /sort by latest update/i });
    expect(updateSortBtn).toBeInTheDocument();
    fireEvent.click(updateSortBtn);

    // Install update button click transitions state
    const installBtn = screen.getAllByRole("button", { name: /^install$/i })[0];
    expect(installBtn).toBeInTheDocument();
    fireEvent.click(installBtn);
  });
});