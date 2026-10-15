import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DesignSystemShowcase } from "./DesignSystemShowcase";

describe("DesignSystemShowcase Component", { timeout: 15000 }, () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders color tokens and typography documentation", () => {
    render(<DesignSystemShowcase />);
    expect(screen.getByText("Skillhouse Design System")).toBeInTheDocument();
    expect(screen.getByText("Brand Orange (Core)")).toBeInTheDocument();
    expect(screen.getAllByText("#FB6320").length).toBeGreaterThanOrEqual(1);
  });

  it("handles loading state toggle on button showcase", () => {
    render(<DesignSystemShowcase />);
    const loadingBtn = screen.getByRole("button", { name: /click for loading state/i });
    fireEvent.click(loadingBtn);
    expect(screen.getAllByRole("button", { name: /loading.../i }).length).toBeGreaterThan(0);
  });

  it("renders audience role pills within audience box", () => {
    render(<DesignSystemShowcase />);
    expect(screen.getAllByText("Graphic Designer").length).toBeGreaterThan(0);
  });
});
