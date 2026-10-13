import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillCard } from "./SkillCard";

const defaultProps = {
    title: "Pixel Promo Video",
    category: "Design",
    previewImage: "/figma/skill-card-preview.png",
  };

describe("Features SkillCard Component", () => {
  it("renders title, category, and image alt text", () => {
    render(<SkillCard {...defaultProps} />);
    expect(screen.getByText("Pixel Promo Video")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByAltText("Pixel Promo Video")).toBeInTheDocument();
  });

  it("triggers onClick when the card is clicked", () => {
    const handleClick = vi.fn();
    render(<SkillCard {...defaultProps} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("article"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("triggers onClick via Enter and Space keyboard navigation", () => {
    const handleClick = vi.fn();
    render(<SkillCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole("article");
    
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Other keys do not trigger click
    fireEvent.keyDown(card, { key: "ArrowDown" });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("handles uncontrolled bookmark toggle, stopPropagation events, and stops propagation to card", () => {
    const handleCardClick = vi.fn();
    const handleToggle = vi.fn();
    render(
      <SkillCard
        {...defaultProps}
        onClick={handleCardClick}
        onBookmarkToggle={handleToggle}
      />
    );

    const bookmarkBtn = screen.getByRole("button", {
      name: /save skill to bookmarks/i,
    });
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "false");

    // Test pointerDown, mouseDown, touchStart propagation stopping
    fireEvent.pointerDown(bookmarkBtn);
    fireEvent.mouseDown(bookmarkBtn);
    fireEvent.touchStart(bookmarkBtn);

    fireEvent.click(bookmarkBtn);
    expect(handleToggle).toHaveBeenCalledWith(true);
    expect(handleCardClick).not.toHaveBeenCalled();
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("handles controlled bookmark state", () => {
    const handleToggle = vi.fn();
    const { rerender } = render(
      <SkillCard
        {...defaultProps}
        isBookmarked={true}
        onBookmarkToggle={handleToggle}
      />
    );

    const bookmarkBtn = screen.getByRole("button", {
      name: /remove from saved skills/i,
    });
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(bookmarkBtn);
    expect(handleToggle).toHaveBeenCalledWith(false);

    rerender(
      <SkillCard
        {...defaultProps}
        isBookmarked={false}
        onBookmarkToggle={handleToggle}
      />
    );
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("renders up to 4 model logo marks", () => {
    const models = ["/logo-1.png", "/logo-2.png", "/logo-3.png", "/logo-4.png", "/logo-5.png"];
    render(<SkillCard {...defaultProps} models={models} />);
    const modelRow = screen.getByLabelText("Supported models");
    expect(modelRow.children.length).toBe(4);
  });

  it("renders without category pill when category is not provided", () => {
    const { container } = render(<SkillCard title="Minimal Card" category={undefined} />);
    expect(screen.getByText("Minimal Card")).toBeInTheDocument();
    expect(container.querySelector("._pill_246e7f")).not.toBeInTheDocument();
  });

  it("renders SkillCardSkeleton loading state when isLoading is true", () => {
    render(<SkillCard {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("skill-card-skeleton")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("renders installs metric badge when installs prop is provided", () => {
    render(<SkillCard {...defaultProps} installs={42} />);
    expect(screen.getByLabelText("42 downloads")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders gradient placeholder behind image container and supports accentGradient", () => {
    const { rerender } = render(<SkillCard {...defaultProps} />);
    expect(screen.getByTestId("skill-card-gradient")).toBeInTheDocument();

    rerender(<SkillCard {...defaultProps} accentGradient="linear-gradient(#111, #222)" />);
    expect(screen.getByTestId("skill-card-gradient")).toBeInTheDocument();
  });
  it("handles pointer leave and keyboard accessibility", () => {
    const handleClick = vi.fn();
    render(<SkillCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole("article");

    fireEvent.pointerLeave(card);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(card, { key: "Tab" });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("handles image error state", () => {
    render(<SkillCard {...defaultProps} />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img).not.toBeInTheDocument();
  });
});
