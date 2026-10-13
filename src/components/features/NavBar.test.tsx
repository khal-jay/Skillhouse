import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NavBar } from "./NavBar";

describe("Features NavBar Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders brand, navigation links, and search bar", () => {
    render(<NavBar />);
    expect(screen.getByAltText("Skillhouse Logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pricing" })).toBeInTheDocument();
    expect(screen.getByTestId("header-request-skill-action-btn")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search skills / outputs")).toBeInTheDocument();
  });

  it("calls onViewChange when brand or skills is clicked", () => {
    const handleViewChange = vi.fn();
    render(<NavBar onViewChange={handleViewChange} />);
    const brand = screen.getByRole("button", { name: /skillhouse home/i });
    fireEvent.click(brand);
    expect(handleViewChange).toHaveBeenCalledWith("home");

    const skillsBtn = screen.getByRole("button", { name: "Skills" });
    fireEvent.click(skillsBtn);
    expect(handleViewChange).toHaveBeenCalledWith("marketplace");
  });

  it("toggles categories mega menu, clicks item, and closes on outside click", () => {
    const handleSelectCategory = vi.fn();
    render(<NavBar onSelectCategory={handleSelectCategory} />);
    const catBtn = screen.getByRole("button", { name: /categories/i });
    expect(catBtn).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Open mega menu
    fireEvent.click(catBtn);
    expect(catBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click an item in the mega menu
    const menuItem = screen.getByText("Web design");
    fireEvent.click(menuItem);
    expect(handleSelectCategory).toHaveBeenCalledWith("Web design");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Open and click See all Skills
    fireEvent.click(catBtn);
    const seeAllBtn = screen.getByRole("button", { name: /see all skills/i });
    fireEvent.click(seeAllBtn);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Click outside to close
    fireEvent.click(catBtn);
    fireEvent.mouseDown(document.body);
    expect(catBtn).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Open and verify no backdrop overlay is rendered (floating transparent glassmorphism)
    fireEvent.click(catBtn);
    expect(screen.queryByTestId("categories-backdrop")).not.toBeInTheDocument();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // Close via Escape key
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles mobile menu drawer and navigates from mobile links", () => {
    const handleViewChange = vi.fn();
    const handleGetStarted = vi.fn();
    render(
      <NavBar
        onViewChange={handleViewChange}
        onGetStarted={handleGetStarted}
      />
    );
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    expect(mobileBtn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(mobileBtn);
    const drawer1 = screen.getByRole("dialog", { name: /mobile navigation/i });
    expect(drawer1).toBeInTheDocument();

    // Click marketplace link in mobile drawer
    const mktLink = within(drawer1).getByRole("button", { name: /skills marketplace/i });
    fireEvent.click(mktLink);
    expect(handleViewChange).toHaveBeenCalledWith("marketplace");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Open again and click design system
    fireEvent.click(mobileBtn);
    const drawer2 = screen.getByRole("dialog", { name: /mobile navigation/i });
    const dsLink = within(drawer2).getByRole("button", { name: /design system/i });
    fireEvent.click(dsLink);
    expect(handleViewChange).toHaveBeenCalledWith("design-system");

    // Open again and click get started in mobile drawer
    fireEvent.click(mobileBtn);
    const drawer3 = screen.getByRole("dialog", { name: /mobile navigation/i });
    const getStartedMobile = within(drawer3).getByRole("button", { name: /get started/i });
    fireEvent.click(getStartedMobile);
    expect(handleGetStarted).toHaveBeenCalledTimes(1);
  });

  it("fires onSearchChange when typing in search input", () => {
    const handleSearch = vi.fn();
    render(<NavBar onSearchChange={handleSearch} />);
    const searchInput = screen.getByPlaceholderText("Search skills / outputs");
    fireEvent.change(searchInput, { target: { value: "automation" } });
    expect(handleSearch).toHaveBeenCalledWith("automation");
  });

  it("calls onGetStarted or onOpenLoginModal when desktop CTA button is clicked", () => {
    const handleLoginModal = vi.fn();
    render(<NavBar onOpenLoginModal={handleLoginModal} />);
    const ctaBtn = screen.getByTestId("header-get-started-btn");
    fireEvent.click(ctaBtn);
    expect(handleLoginModal).toHaveBeenCalledTimes(1);
  });

  it("renders user avatar and toggles profile menu when isSignedIn is true", () => {
    const handleSignOut = vi.fn();
    render(
      <NavBar
        isSignedIn={true}
        onSignOut={handleSignOut}
        user={{ name: "Jane Doe", email: "jane@test.com" }}
      />
    );
    const avatarBtn = screen.getByTestId("header-avatar-button");
    expect(avatarBtn).toBeInTheDocument();
    expect(screen.queryByTestId("header-get-started-btn")).not.toBeInTheDocument();

    // Open user menu
    fireEvent.click(avatarBtn);
    expect(screen.getByText(/my skills|bookmarks/i)).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();

    // Click Logout
    const logoutBtn = screen.getByRole("menuitem", { name: /logout/i });
    fireEvent.click(logoutBtn);
    expect(handleSignOut).toHaveBeenCalledTimes(1);
  });

  it("toggles view between marketplace and design-system", () => {
    const handleViewChange = vi.fn();
    render(
      <NavBar
        currentView="marketplace"
        onViewChange={handleViewChange}
      />
    );
    const toggleBadge = screen.getByRole("button", { name: /design system/i });
    fireEvent.click(toggleBadge);
    expect(handleViewChange).toHaveBeenCalledWith("design-system");
  });

  it("handles user menu popover callbacks in signed-in state", () => {
    const handleSignOut = vi.fn();
    render(<NavBar isSignedIn={true} onSignOut={handleSignOut} />);

    const avatarBtn = screen.getByTestId("header-avatar-button");
    fireEvent.click(avatarBtn);

    // Profile click
    fireEvent.click(screen.getByText("Profile"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Reopen and test Account settings
    fireEvent.click(avatarBtn);
    fireEvent.click(screen.getByText("Account settings"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Reopen and test Bookmarks
    fireEvent.click(avatarBtn);
    fireEvent.click(screen.getByText(/my skills|bookmarks/i));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Click square action button
    const actionBtn = screen.getByTestId("header-request-skill-action-btn");
    fireEvent.click(actionBtn);
  });

  it("routes to login/account creation when square action button or mobile drawer is clicked while signed out", () => {
    const handleLoginModal = vi.fn();
    render(<NavBar onOpenLoginModal={handleLoginModal} />);

    // Click square action button when logged out -> routes to account creation / login modal
    const actionBtn = screen.getByTestId("header-request-skill-action-btn");
    fireEvent.click(actionBtn);
    expect(handleLoginModal).toHaveBeenCalledTimes(1);

    // Open mobile drawer and click Request a skill -> routes to account creation / login modal
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);
    const drawer = screen.getByRole("dialog", { name: /mobile navigation/i });
    const mobileRequest = within(drawer).getByRole("button", { name: /request a skill/i });
    fireEvent.click(mobileRequest);
    expect(handleLoginModal).toHaveBeenCalledTimes(2);
  });

  it("triggers onRequestSkill when square action button or mobile drawer is clicked while signed in", () => {
    const handleRequestSkill = vi.fn();
    render(
      <NavBar
        isSignedIn={true}
        onRequestSkill={handleRequestSkill}
        user={{ name: "Jane Doe", email: "jane@test.com" }}
      />
    );

    // Click desktop square action button
    const actionBtn = screen.getByTestId("header-request-skill-action-btn");
    fireEvent.click(actionBtn);
    expect(handleRequestSkill).toHaveBeenCalledTimes(1);

    // Open mobile drawer and click
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);
    const drawer = screen.getByRole("dialog", { name: /mobile navigation/i });
    const mobileRequest = within(drawer).getByRole("button", { name: /request a skill/i });
    fireEvent.click(mobileRequest);
    expect(handleRequestSkill).toHaveBeenCalledTimes(2);
  });

  it("navigates to my-skills workspace when mobile drawer link is clicked", () => {
    const handleViewChange = vi.fn();
    render(<NavBar onViewChange={handleViewChange} />);

    // Click My Skills link in mobile drawer
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);
    const drawer = screen.getByRole("dialog", { name: /mobile navigation/i });
    const mobileMySkills = within(drawer).getByRole("button", { name: /my skills workspace/i });
    fireEvent.click(mobileMySkills);
    expect(handleViewChange).toHaveBeenCalledWith("my-skills");
  });

  it("ensures request a skill icon is visible both when logged in and logged out", () => {
    const { rerender } = render(<NavBar isSignedIn={false} />);
    expect(screen.getByTestId("header-request-skill-action-btn")).toBeInTheDocument();

    rerender(<NavBar isSignedIn={true} user={{ name: "Alex Vance" }} />);
    expect(screen.getByTestId("header-request-skill-action-btn")).toBeInTheDocument();
  });

  it("triggers onOpenCommandPalette when mobile search button or shortcut key is pressed", () => {
    const handleCommandPalette = vi.fn();
    render(<NavBar onOpenCommandPalette={handleCommandPalette} />);

    // Mobile search button
    const mobileSearchBtn = screen.getByRole("button", { name: /open command palette search/i });
    fireEvent.click(mobileSearchBtn);
    expect(handleCommandPalette).toHaveBeenCalledTimes(1);

    // ⌘K shortcut inside search input
    const searchInput = screen.getByPlaceholderText("Search skills / outputs");
    fireEvent.keyDown(searchInput, { key: "k", metaKey: true });
    expect(handleCommandPalette).toHaveBeenCalledTimes(2);
  });

  it("wires up onOpenProfile, onOpenSettings, and onOpenHelpCenter from user menu", () => {
    const handleProfile = vi.fn();
    const handleSettings = vi.fn();
    const handleHelp = vi.fn();

    render(
      <NavBar
        isSignedIn={true}
        user={{ name: "Alex Vance", email: "alex@skillhouse.ai" }}
        onOpenProfile={handleProfile}
        onOpenSettings={handleSettings}
        onOpenHelpCenter={handleHelp}
      />
    );

    const avatarBtn = screen.getByTestId("header-avatar-button");

    // Open and click Profile
    fireEvent.click(avatarBtn);
    fireEvent.click(screen.getByTestId("user-menu-item-profile"));
    expect(handleProfile).toHaveBeenCalledTimes(1);

    // Open and click Account settings
    fireEvent.click(avatarBtn);
    fireEvent.click(screen.getByTestId("user-menu-item-settings"));
    expect(handleSettings).toHaveBeenCalledTimes(1);

    // Open and click Help center
    fireEvent.click(avatarBtn);
    fireEvent.click(screen.getByTestId("user-menu-item-help"));
    expect(handleHelp).toHaveBeenCalledTimes(1);
  });

  it("renders search bar, request a skill button, and get started button with matched action items", () => {
    render(<NavBar isSignedIn={false} />);

    const searchInput = screen.getByPlaceholderText("Search skills / outputs");
    const requestSkillBtn = screen.getByTestId("header-request-skill-action-btn");
    const getStartedBtn = screen.getByTestId("header-get-started-btn");

    expect(searchInput).toBeInTheDocument();
    expect(requestSkillBtn).toBeInTheDocument();
    expect(getStartedBtn).toBeInTheDocument();
});
  it("handles mobile drawer sign-out and user menu directory history callback", () => {
    const handleSignOut = vi.fn();
    const handleViewChange = vi.fn();

    render(
      <NavBar
        isSignedIn={true}
        onSignOut={handleSignOut}
        onViewChange={handleViewChange}
        user={{ name: "Alex Vance", email: "alex@acme.dev" }}
      />
    );

    // 1. Open User Menu Popover and click Bookmarks
    const avatarBtn = screen.getByTestId("header-avatar-button");
    fireEvent.click(avatarBtn);
    const bookmarksItem = screen.getByRole("menuitem", { name: /my skills|bookmarks/i });
    fireEvent.click(bookmarksItem);
    expect(handleViewChange).toHaveBeenCalledWith("my-skills");

    // 2. Open Mobile Menu while signed in
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);

    // Verify user info is shown in mobile drawer
    expect(screen.getByText("Alex Vance")).toBeInTheDocument();
    expect(screen.getByText("alex@acme.dev")).toBeInTheDocument();

    // Click Mobile Sign out
    const mobileSignOut = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(mobileSignOut);
    expect(handleSignOut).toHaveBeenCalled();
  });
  it("handles clicking mobile pricing link and user menu items without onViewChange callback", () => {
    const handleLogin = vi.fn();
    render(<NavBar onOpenLoginModal={handleLogin} />);

    // Open mobile menu
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);

    // Click mobile pricing link
    const drawer = screen.getByRole("dialog", { name: /mobile navigation/i });
    const pricingBtn = within(drawer).getByRole("button", { name: /^pricing$/i });
    fireEvent.click(pricingBtn);
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });
  it("handles logout when onSignOut callback is not passed", () => {
    render(<NavBar isSignedIn={true} />);
    const avatarBtn = screen.getByTestId("header-avatar-button");
    fireEvent.click(avatarBtn);
    const logoutBtn = screen.getByRole("menuitem", { name: /logout/i });
    fireEvent.click(logoutBtn);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("submits search on Enter key press and handles help center when callback is omitted", () => {
    const handleSearchSubmit = vi.fn();
    render(<NavBar onSearchSubmit={handleSearchSubmit} searchValue="Claude" isSignedIn={true} />);

    // Press Enter in search input
    const searchInput = screen.getByPlaceholderText("Search skills / outputs");
    fireEvent.keyDown(searchInput, { key: "Enter" });
    expect(handleSearchSubmit).toHaveBeenCalledWith("Claude");

    // Open avatar menu and click Help center without onOpenHelpCenter callback
    const avatarBtn = screen.getByTestId("header-avatar-button");
    fireEvent.click(avatarBtn);
    const helpBtn = screen.getByRole("menuitem", { name: /help center/i });
    fireEvent.click(helpBtn);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
