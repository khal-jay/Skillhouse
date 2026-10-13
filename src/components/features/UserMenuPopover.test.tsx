import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserMenuPopover } from "./UserMenuPopover";

describe("UserMenuPopover Component (Figma Node 4626:379155)", () => {
  it("renders all items from Figma Node 4626:379155 (drop down menu/attending)", () => {
    render(<UserMenuPopover />);

    expect(screen.getByText("My Skills")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account settings")).toBeInTheDocument();
    expect(screen.getByText("Help center")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // In standard attending variant, Switch to is not present
    expect(screen.queryByText("Switch to")).not.toBeInTheDocument();
  });

  it("renders extended items when variant is extended, with Directory history label fallback", () => {
    render(<UserMenuPopover variant="extended" onDirectoryHistory={() => {}} />);

    expect(screen.getByText("Directory history")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account settings")).toBeInTheDocument();
    expect(screen.getByText("Help center")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("triggers callbacks when menu items are clicked", () => {
    const handleMySkills = vi.fn();
    const handleProfile = vi.fn();
    const handleSettings = vi.fn();
    const handleHelp = vi.fn();
    const handleLogout = vi.fn();

    render(
      <UserMenuPopover
        onMySkills={handleMySkills}
        onProfile={handleProfile}
        onAccountSettings={handleSettings}
        onHelpCenter={handleHelp}
        onLogout={handleLogout}
      />
    );

    fireEvent.click(screen.getByText("My Skills"));
    expect(handleMySkills).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Profile"));
    expect(handleProfile).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Account settings"));
    expect(handleSettings).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Help center"));
    expect(handleHelp).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Logout"));
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("supports onBookmarks fallback for My Skills item", () => {
    const handleBookmarks = vi.fn();
    render(<UserMenuPopover onBookmarks={handleBookmarks} />);

    fireEvent.click(screen.getByText("My Skills"));
    expect(handleBookmarks).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard navigation with ArrowDown, ArrowUp, Home, End, Escape", () => {
    const handleClose = vi.fn();
    render(<UserMenuPopover onClose={handleClose} />);

    const menu = screen.getByRole("menu");
    const mySkillsBtn = screen.getByTestId("user-menu-item-my-skills");
    const profileBtn = screen.getByTestId("user-menu-item-profile");
    const logoutBtn = screen.getByTestId("user-menu-item-logout");

    // Start with My Skills focused
    mySkillsBtn.focus();
    expect(document.activeElement).toBe(mySkillsBtn);

    // ArrowDown moves to Profile
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(profileBtn);

    // ArrowUp moves back to My Skills
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(mySkillsBtn);

    // End moves to Logout
    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toBe(logoutBtn);

    // Home moves back to My Skills
    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toBe(mySkillsBtn);

    // Escape triggers onClose
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders active item indicator when activeItem is specified", () => {
    render(<UserMenuPopover activeItem="my-skills" />);
    const mySkillsBtn = screen.getByTestId("user-menu-item-my-skills");
    expect(mySkillsBtn.className).toContain("activeItem");
  });

  it("calls onClose on outside click", () => {
    const handleClose = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside area</div>
        <UserMenuPopover onClose={handleClose} />
      </div>
    );

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("handles directory history click when onMySkills and onBookmarks are omitted", () => {
    const handleHistory = vi.fn();
    render(<UserMenuPopover variant="extended" onDirectoryHistory={handleHistory} />);

    const dirItem = screen.getByTestId("user-menu-item-my-skills");
    fireEvent.click(dirItem);
    expect(handleHistory).toHaveBeenCalledTimes(1);
  });

  it("handles ArrowUp and ArrowDown when no element is focused", () => {
    render(<UserMenuPopover />);
    const menu = screen.getByRole("menu");
    const mySkillsBtn = screen.getByTestId("user-menu-item-my-skills");
    const logoutBtn = screen.getByTestId("user-menu-item-logout");

    // Blur active element
    (document.activeElement as HTMLElement)?.blur();

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(mySkillsBtn);

    (document.activeElement as HTMLElement)?.blur();
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(logoutBtn);
  });
});
