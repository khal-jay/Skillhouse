import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AsciiCanvas, VISUAL_CANVAS_SLIDES } from "./AsciiCanvas";

describe("Features AsciiCanvas Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders blueprint mode by default with active slide content", () => {
    render(<AsciiCanvas activeSlideIndex={0} skillTitle="Visual Canvas Deck" />);

    expect(screen.getByTestId("ascii-canvas-container")).toBeInTheDocument();
    expect(screen.getByTestId("ascii-blueprint-pre")).toBeInTheDocument();
    expect(screen.getByText("01: BRIEF")).toBeInTheDocument();
    expect(screen.getByText("Slide 1 of 3")).toBeInTheDocument();
  });

  it("toggles to ASCII matrix mode when toggle button is clicked", async () => {
    render(<AsciiCanvas activeSlideIndex={1} skillTitle="Visual Canvas Deck" />);

    const toggleBtn = screen.getByRole("button", { name: /Toggle view mode/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click toggle to enter matrix mode
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("ascii-matrix-canvas")).toBeInTheDocument();

    // Hover and mouse move in matrix mode, close enough to perturb some glyphs
    const container = screen.getByTestId("ascii-canvas-container");
    fireEvent.mouseEnter(container);
    fireEvent.mouseMove(container, { clientX: 120, clientY: 80 });

    // Let the mocked requestAnimationFrame loop actually paint a frame so the
    // glyph-selection branches in renderLoop execute, not just get scheduled.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    fireEvent.mouseLeave(container);

    // Toggle back to blueprint mode
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("ascii-blueprint-pre")).toBeInTheDocument();
  });

  it("safely clamps slide index out of range", () => {
    render(<AsciiCanvas activeSlideIndex={99} skillTitle="Visual Canvas Deck" />);

    // Should clamp to slide 3
    expect(screen.getByText("Slide 3 of 3")).toBeInTheDocument();
    expect(screen.getByText("03: PPTX")).toBeInTheDocument();
  });
});
