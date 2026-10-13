import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkillDocViewer } from "./SkillDocViewer";

describe("SkillDocViewer Component", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders Overview tab by default with problem and capabilities", () => {
    render(<SkillDocViewer />);
    expect(screen.getByTestId("skill-doc-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("panel-overview")).toBeInTheDocument();
    expect(screen.getByText(/problem solved/i)).toBeInTheDocument();
    expect(screen.getByText(/core capabilities/i)).toBeInTheDocument();
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

  it("switches to Reviews & Changelog tab and renders ratings and version history", () => {
    render(<SkillDocViewer />);
    const reviewsTabBtn = screen.getByTestId("tab-reviews-btn");
    fireEvent.click(reviewsTabBtn);

    expect(screen.getByTestId("panel-reviews")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
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
});
