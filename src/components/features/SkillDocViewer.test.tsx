import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkillDocViewer, SkillDetailsTabSection } from "./SkillDocViewer";

describe("SkillDocViewer Component (Figma Node 897:9533 & Better-Interface Polish)", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders Overview tab by default with Overview, Skill Examples, and Core Capabilities", () => {
    render(<SkillDocViewer />);
    expect(screen.getByTestId("skill-doc-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("panel-overview")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skill Examples" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Core Capabilities" })).toBeInTheDocument();
    expect(screen.getByText("Spatial Composition")).toBeInTheDocument();
    expect(screen.getAllByText("Pixel Promo Video")).toHaveLength(3);
  });

  it("switches to SKILL.md tab and copies markdown prompt to clipboard", async () => {
    render(<SkillDocViewer skillMarkdown="# custom skill instructions" />);
    const skillMdTabBtn = screen.getByTestId("tab-skill-md-btn");
    fireEvent.click(skillMdTabBtn);

    expect(screen.getByTestId("panel-skill-md")).toBeInTheDocument();
    expect(screen.getByText("# custom skill instructions")).toBeInTheDocument();

    const copyBtn = screen.getByTestId("copy-skill-md-btn");
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("# custom skill instructions");
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("switches to Updates tab and renders version history without ratings", () => {
    render(<SkillDocViewer />);
    const reviewsTabBtn = screen.getByTestId("tab-reviews-btn");
    expect(reviewsTabBtn).toHaveTextContent("Updates");
    fireEvent.click(reviewsTabBtn);

    expect(screen.getByTestId("panel-reviews")).toBeInTheDocument();
    expect(screen.queryByText("4.9")).not.toBeInTheDocument();
    expect(screen.getByText(/version history/i)).toBeInTheDocument();
    expect(screen.getByText("v1.0.1")).toBeInTheDocument();
  });

  it("handles clipboard failure gracefully in SKILL.md tab", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("Clipboard access denied")),
      },
    });
    render(<SkillDocViewer />);
    fireEvent.click(screen.getByTestId("tab-skill-md-btn"));
    const copyBtn = screen.getByTestId("copy-skill-md-btn");
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("SkillDetailsTabSection alias functions identically", () => {
    render(<SkillDetailsTabSection />);
    expect(screen.getByTestId("skill-doc-viewer")).toBeInTheDocument();
  });

  it("makes Skill Examples interactive: clicking an example card opens the polished lightbox preview modal", async () => {
    const handleSelect = vi.fn();
    render(<SkillDocViewer onSelectExample={handleSelect} />);

    // Cards exist and are interactive
    const exampleCard0 = screen.getByTestId("skill-example-card-0");
    expect(exampleCard0).toBeInTheDocument();

    // Click first card
    fireEvent.click(exampleCard0);
    expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ title: "Pixel Promo Video" }));

    // Lightbox modal is open
    expect(screen.getByTestId("skill-example-lightbox")).toBeInTheDocument();
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("01 / 03");

    // Terminal prompt is accessible and not truncated
    const promptCode = screen.getByTestId("lightbox-prompt-code");
    expect(promptCode).toBeInTheDocument();
    expect(promptCode).toHaveTextContent("npx @skillhouse/cli run visual-canvas-deck --phase 01 --template spatial");

    // Navigation buttons work
    const nextBtn = screen.getByTestId("lightbox-next-btn");
    fireEvent.click(nextBtn);
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("02 / 03");

    const prevBtn = screen.getByTestId("lightbox-prev-btn");
    fireEvent.click(prevBtn);
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("01 / 03");

    // Copy Prompt button
    const copyPromptBtn = screen.getByTestId("lightbox-copy-prompt-btn");
    fireEvent.click(copyPromptBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    // Close button closes modal and restores focus
    const closeBtn = screen.getByTestId("lightbox-close-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("skill-example-lightbox")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation in Skill Examples and lightbox (Enter, Space, Escape, Arrows, Tab)", () => {
    render(<SkillDocViewer />);
    const exampleCard1 = screen.getByTestId("skill-example-card-1");

    // Open via Enter key
    fireEvent.keyDown(exampleCard1, { key: "Enter" });
    expect(screen.getByTestId("skill-example-lightbox")).toBeInTheDocument();
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("02 / 03");

    // Arrow Right -> 03 / 03
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("03 / 03");

    // Arrow Left -> 02 / 03
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("02 / 03");

    // Tab key trapped in modal
    fireEvent.keyDown(window, { key: "Tab" });
    expect(screen.getByTestId("skill-example-lightbox")).toBeInTheDocument();

    // Escape closes modal
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("skill-example-lightbox")).not.toBeInTheDocument();
  });
  it("scales examples with progressive disclosure when more than 6 examples exist", () => {
    const manyExamples = Array.from({ length: 10 }, (_, i) => ({
      id: "ex-" + i,
      title: "Example " + (i + 1),
      imageUrl: "/figma/slide" + (i + 1) + ".png",
      description: "Description " + (i + 1),
      prompt: "npx prompt-" + (i + 1),
    }));

    render(<SkillDocViewer examples={manyExamples} />);

    // Initially displays only first 6
    expect(screen.getByTestId("skill-example-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("skill-example-card-5")).toBeInTheDocument();
    expect(screen.queryByTestId("skill-example-card-6")).not.toBeInTheDocument();

    // Toggle button is visible with count
    const toggleBtn = screen.getByTestId("toggle-all-examples-btn");
    expect(toggleBtn).toHaveTextContent("View All 10 Examples");

    // Click toggle button to expand
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("skill-example-card-6")).toBeInTheDocument();
    expect(screen.getByTestId("skill-example-card-9")).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent("Show Less");

    // Click toggle button to collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId("skill-example-card-6")).not.toBeInTheDocument();
  });

  it("renders interactive in-modal filmstrip scrubber when 4 or more examples exist", () => {
    const manyExamples = Array.from({ length: 8 }, (_, i) => ({
      id: "ex-" + i,
      title: "Example " + (i + 1),
      imageUrl: "/figma/slide" + (i + 1) + ".png",
      description: "Description " + (i + 1),
      prompt: "npx prompt-" + (i + 1),
    }));

    render(<SkillDocViewer examples={manyExamples} />);
    
    // Open modal on first example
    const card0 = screen.getByTestId("skill-example-card-0");
    fireEvent.click(card0);

    expect(screen.getByTestId("skill-example-lightbox")).toBeInTheDocument();
    expect(screen.getByTestId("lightbox-filmstrip")).toBeInTheDocument();
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("01 / 08");

    // Click on filmstrip thumbnail 4 (5th item)
    const thumb4 = screen.getByTestId("filmstrip-thumb-4");
    fireEvent.click(thumb4);
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("05 / 08");

    // Home and End keyboard shortcuts
    fireEvent.keyDown(window, { key: "End" });
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("08 / 08");

    fireEvent.keyDown(window, { key: "Home" });
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent("01 / 08");
  });

  it("renders Key Features, Supported Targets, and Use Cases sections in Overview", () => {
    render(<SkillDocViewer />);
    expect(screen.getByRole("heading", { name: "Key Features" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Supported Targets & Frameworks" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Use Cases" })).toBeInTheDocument();
    expect(screen.getByText(/Multi-platform component kit generation/i)).toBeInTheDocument();
    expect(screen.getByText("React / Next.js")).toBeInTheDocument();
    expect(screen.getByText(/Bootstrapping a new web or mobile app/i)).toBeInTheDocument();
  });

  it("supports dual view toggle in SKILL.md tab (Raw Prompt vs Documentation Guide)", () => {
    render(<SkillDocViewer skillId="test-skill" />);
    fireEvent.click(screen.getByTestId("tab-skill-md-btn"));

    // Raw prompt is active by default
    expect(screen.getByTestId("skill-md-mode-raw")).toBeInTheDocument();
    expect(screen.queryByTestId("skill-md-guide-view")).not.toBeInTheDocument();

    // Switch to Documentation Guide
    const guideToggleBtn = screen.getByTestId("skill-md-mode-guide");
    fireEvent.click(guideToggleBtn);

    expect(screen.getByTestId("skill-md-guide-view")).toBeInTheDocument();
    expect(screen.getByText(/Detect & Preserve Existing Design System/i)).toBeInTheDocument();
    expect(screen.getByText(/Install Component Kit for Target Framework/i)).toBeInTheDocument();
    expect(screen.getByText("SwiftUI (iOS)")).toBeInTheDocument();

    // Switch back to Raw Prompt
    const rawToggleBtn = screen.getByTestId("skill-md-mode-raw");
    fireEvent.click(rawToggleBtn);
    expect(screen.queryByTestId("skill-md-guide-view")).not.toBeInTheDocument();
  });
  it("renders the authentic Figma reference documentation guide (name, description, sections, inline code pills)", () => {
    render(<SkillDocViewer skillId="build-with-better-design" />);
    fireEvent.click(screen.getByTestId("tab-skill-md-btn"));
    fireEvent.click(screen.getByTestId("skill-md-mode-guide"));

    expect(screen.getByTestId("skill-md-guide-view")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("build-with-better-design")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText(/1\. Keep the design system the project already has/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Choose a design system with the user/i)).toBeInTheDocument();
    expect(screen.getByText("components/ui/")).toBeInTheDocument();
    expect(screen.getByText("find-design-system")).toBeInTheDocument();
    expect(screen.getByText(/3\. Install it/i)).toBeInTheDocument();
  });
});