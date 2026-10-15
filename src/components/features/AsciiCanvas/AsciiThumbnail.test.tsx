import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AsciiThumbnail } from "./AsciiThumbnail";
import { VISUAL_CANVAS_SLIDES } from "./AsciiCanvas";

describe("Features AsciiThumbnail Component", () => {
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

  it("renders slide badge, title, and canvas for slide 0 (Prompt outline)", () => {
    render(
      <AsciiThumbnail
        slideIndex={0}
        slide={VISUAL_CANVAS_SLIDES[0]}
        isActive={false}
      />
    );

    expect(screen.getByText("01: BRIEF")).toBeInTheDocument();
    expect(screen.getByText("Prompt ➔ Spatial Outline")).toBeInTheDocument();
    expect(screen.getByTestId("ascii-thumbnail-inner-0")).toBeInTheDocument();
    expect(screen.getByTestId("ascii-canvas-thumb-0")).toBeInTheDocument();
  });

  it("renders active state properly when isActive is true", () => {
    const { container } = render(
      <AsciiThumbnail
        slideIndex={1}
        slide={VISUAL_CANVAS_SLIDES[1]}
        isActive={true}
      />
    );

    const inner = screen.getByTestId("ascii-thumbnail-inner-1");
    expect(inner.className).toContain("active");
  });

  it("handles mouse enter, move, and leave interactions without errors", async () => {
    render(
      <AsciiThumbnail
        slideIndex={2}
        slide={VISUAL_CANVAS_SLIDES[2]}
        isActive={false}
      />
    );

    const inner = screen.getByTestId("ascii-thumbnail-inner-2");

    // Simulate hover and mouse move
    fireEvent.mouseEnter(inner);
    fireEvent.mouseMove(inner, { clientX: 50, clientY: 20 });

    // Let the mocked requestAnimationFrame loop actually paint a frame so the
    // brightness-tier and mouse-disturbance branches in renderLoop execute.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    fireEvent.mouseLeave(inner);

    expect(inner).toBeInTheDocument();
  });
});
