import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillBreadcrumbs } from "./SkillBreadcrumbs";

describe("SkillBreadcrumbs Component", () => {
  it("renders default breadcrumb navigation with back button and breadcrumb items", () => {
    render(
      <SkillBreadcrumbs
        category="Presentations"
        skillTitle="Primary Doodle Deck"
      />
    );

    expect(screen.getByTestId("skill-breadcrumbs-bar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back to skills marketplace/i })).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();

    expect(within(nav).getByText("Home")).toBeInTheDocument();
    expect(within(nav).getByText("Skills")).toBeInTheDocument();
    expect(within(nav).getByText("Presentations")).toBeInTheDocument();

    const currentPill = within(nav).getByText("Primary Doodle Deck");
    expect(currentPill).toHaveAttribute("aria-current", "page");
  });

  it("handles back button callback correctly", () => {
    const handleBack = vi.fn();
    render(<SkillBreadcrumbs onBack={handleBack} />);

    const backBtn = screen.getByRole("button", { name: /back to skills marketplace/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it("handles breadcrumb link clicks with custom callbacks", () => {
    const handleHome = vi.fn();
    const handleMarketplace = vi.fn();
    const handleCategory = vi.fn();

    render(
      <SkillBreadcrumbs
        category="Code & Dev"
        skillTitle="Python Formatter"
        onNavigateHome={handleHome}
        onNavigateMarketplace={handleMarketplace}
        onNavigateCategory={handleCategory}
      />
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    fireEvent.click(within(nav).getByText("Home"));
    expect(handleHome).toHaveBeenCalledTimes(1);

    fireEvent.click(within(nav).getByText("Skills"));
    expect(handleMarketplace).toHaveBeenCalledTimes(1);

    fireEvent.click(within(nav).getByText("Code & Dev"));
    expect(handleCategory).toHaveBeenCalledWith("Code & Dev");
  });

  it("supports completely custom crumbs array", () => {
    const customClick = vi.fn();
    render(
      <SkillBreadcrumbs
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics", onClick: customClick },
          { label: "Reports", isCurrent: true },
        ]}
      />
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(nav).getByText("Dashboard")).toBeInTheDocument();

    const analyticsLink = within(nav).getByText("Analytics");
    fireEvent.click(analyticsLink);
    expect(customClick).toHaveBeenCalledTimes(1);

    const currentReport = within(nav).getByText("Reports");
    expect(currentReport).toHaveAttribute("aria-current", "page");
  });
});
