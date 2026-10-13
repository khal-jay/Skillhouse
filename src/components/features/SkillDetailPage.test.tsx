import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillDetailPage, DEFAULT_DETAIL_SKILL } from "./SkillDetailPage";
import { AuthProvider } from "@/lib/AuthContext";

const mockPush = vi.fn();
const mockBack = vi.fn();

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe("SkillDetailPage Component (Figma Node 751:5602)", () => {
  it("renders breadcrumbs trail, title, and default elements", () => {
    render(<SkillDetailPage />);

    // Breadcrumb bar
    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();

    expect(within(breadcrumbNav).getByText("Home")).toBeInTheDocument();
    expect(within(breadcrumbNav).getByText("Skills")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: DEFAULT_DETAIL_SKILL.title })).toBeInTheDocument();
  });

  it("renders preview gallery and switches active image when thumbnail tab is clicked", () => {
    render(<SkillDetailPage />);

    const mainPreview = screen.getByTestId("skill-detail-main-preview");
    expect(mainPreview).toBeInTheDocument();

    // Check thumbnails
    const thumb0 = screen.getByTestId("thumbnail-tab-0");
    const thumb1 = screen.getByTestId("thumbnail-tab-1");
    expect(thumb0).toHaveAttribute("aria-selected", "true");
    expect(thumb1).toHaveAttribute("aria-selected", "false");

    // Click second thumbnail
    fireEvent.click(thumb1);
    expect(thumb1).toHaveAttribute("aria-selected", "true");
    expect(thumb0).toHaveAttribute("aria-selected", "false");
  });

  it("renders Similar Skills carousel and triggers skill navigation callback", () => {
    const onNavigateSkill = vi.fn();
    render(<SkillDetailPage onNavigateSkill={onNavigateSkill} />);

    expect(screen.getByRole("heading", { level: 2, name: /similar skills/i })).toBeInTheDocument();
    const similarGrid = screen.getByTestId("similar-skills-grid");
    expect(similarGrid).toBeInTheDocument();

    // Find cards in similar grid
    const cards = within(similarGrid).getAllByRole("article");
    expect(cards.length).toBeGreaterThan(0);

    // Click the first similar skill card
    fireEvent.click(cards[0]);
    expect(onNavigateSkill).toHaveBeenCalled();
  });

  it("handles carousel controls next and previous without errors", () => {
    render(<SkillDetailPage />);

    const prevBtn = screen.getByRole("button", { name: /previous similar skills/i });
    const nextBtn = screen.getByRole("button", { name: /next similar skills/i });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);
  });

  it("invokes navigation callbacks when breadcrumb links are clicked", () => {
    const onNavigateHome = vi.fn();
    const onNavigateMarketplace = vi.fn();

    render(
      <SkillDetailPage
        onNavigateHome={onNavigateHome}
        onNavigateMarketplace={onNavigateMarketplace}
      />
    );

    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    fireEvent.click(within(breadcrumbNav).getByText("Home"));
    expect(onNavigateHome).toHaveBeenCalledTimes(1);

    fireEvent.click(within(breadcrumbNav).getByText("Skills"));
    expect(onNavigateMarketplace).toHaveBeenCalledTimes(1);
  });

  it("renders semantic accessible ordered list for breadcrumbs with current page", () => {
    render(<SkillDetailPage />);
    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();

    const list = within(breadcrumbNav).getByRole("list");
    expect(list).toBeInTheDocument();

    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(4);

    const currentPage = within(breadcrumbNav).getByText(DEFAULT_DETAIL_SKILL.title);
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("handles navbar view change for my-skills and design-system", () => {
    mockPush.mockClear();
    render(<SkillDetailPage />);

    // Open mobile menu to click My Skills
    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);
    const mySkillsLink = screen.getByText("My Skills Workspace");
    fireEvent.click(mySkillsLink);
    expect(mockPush).toHaveBeenCalledWith("/?view=my-skills");
  });

  it("falls back to router navigation when callbacks are omitted", () => {
    mockPush.mockClear();
    mockBack.mockClear();

    render(<SkillDetailPage />);

    // Click similar skill card falls back to router.push
    const similarGrid = screen.getByTestId("similar-skills-grid");
    const cards = within(similarGrid).getAllByRole("article");
    fireEvent.click(cards[0]);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/skills/"));
  });
  it("does not render redundant back button and maintains pure breadcrumb navigation", () => {
    render(<SkillDetailPage onBack={vi.fn()} />);
    expect(screen.queryByTestId("skill-detail-back-btn")).not.toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it("handles navbar view changes with custom callbacks", () => {
    const onNavigateHome = vi.fn();
    const onNavigateMarketplace = vi.fn();
    render(
      <SkillDetailPage
        onNavigateHome={onNavigateHome}
        onNavigateMarketplace={onNavigateMarketplace}
      />
    );

    const brand = screen.getByRole("button", { name: /skillhouse home/i });
    fireEvent.click(brand);
    expect(onNavigateHome).toHaveBeenCalledTimes(1);

    const skillsBtn = screen.getByRole("button", { name: /^skills$/i });
    fireEvent.click(skillsBtn);
    expect(onNavigateMarketplace).toHaveBeenCalledTimes(1);
  });

  it("handles navbar view change fallbacks to router", () => {
    mockPush.mockClear();
    render(<SkillDetailPage />);

    const brand = screen.getByRole("button", { name: /skillhouse home/i });
    fireEvent.click(brand);
    expect(mockPush).toHaveBeenCalledWith("/");

    const skillsBtn = screen.getByRole("button", { name: /^skills$/i });
    fireEvent.click(skillsBtn);
    expect(mockPush).toHaveBeenCalledWith("/skills");
  });

  it("opens login modal from navbar get started and signed-out request skill actions", () => {
    render(<SkillDetailPage />);

    const getStartedBtn = screen.getByTestId("header-get-started-btn");
    fireEvent.click(getStartedBtn);
    expect(screen.getByRole("dialog", { name: /welcome to skillhouse/i })).toBeInTheDocument();

    // When signed out, request a skill button routes to login modal
    const requestSkillBtn = screen.getByTestId("header-request-skill-action-btn");
    fireEvent.click(requestSkillBtn);
    expect(screen.getByRole("dialog", { name: /welcome to skillhouse/i })).toBeInTheDocument();
  });

  it("navigates to category when category breadcrumb item is clicked", () => {
    const handleMarketplace = vi.fn();
    render(<SkillDetailPage onNavigateMarketplace={handleMarketplace} />);

    const breadcrumbNav = screen.getByRole("navigation", { name: /breadcrumb/i });
    const catLink = within(breadcrumbNav).getByText(DEFAULT_DETAIL_SKILL.category);
    fireEvent.click(catLink);
    expect(handleMarketplace).toHaveBeenCalled();
  });
  it("navigates to design-system when navbar switches view", () => {
    mockPush.mockClear();
    render(<SkillDetailPage />);

    const mobileBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(mobileBtn);
    const mobileNav = screen.getByRole("dialog", { name: /mobile navigation/i });
    const designSystemLink = within(mobileNav).getByText("Design System");
    fireEvent.click(designSystemLink);
    expect(mockPush).toHaveBeenCalledWith("/design-system");
  });

  it("closes login and request modals when onClose is called", () => {
    render(<SkillDetailPage />);

    const getStartedBtn = screen.getByTestId("header-get-started-btn");
    fireEvent.click(getStartedBtn);
    const loginModal = screen.getByRole("dialog", { name: /welcome to skillhouse/i });
    expect(loginModal).toBeInTheDocument();

    const closeLoginBtn = within(loginModal).getByRole("button", { name: /close dialog/i });
    fireEvent.click(closeLoginBtn);
    expect(screen.queryByRole("dialog", { name: /welcome to skillhouse/i })).not.toBeInTheDocument();
  });  it("completes full login flow directly from skill detail page, renders user avatar, and opens user profile and help center modals", async () => {
    render(<SkillDetailPage />);

    // 1. Initial State: "Get started" button is visible, avatar is not
    const getStartedBtn = screen.getByTestId("header-get-started-btn");
    expect(getStartedBtn).toBeInTheDocument();
    expect(screen.queryByTestId("header-avatar-button")).not.toBeInTheDocument();

    // 2. Click "Get started" -> LoginModal opens
    fireEvent.click(getStartedBtn);
    expect(screen.getByRole("dialog", { name: /welcome to skillhouse/i })).toBeInTheDocument();

    // 3. Click "Continue with Google" -> Logs in
    const googleLoginBtn = screen.getByTestId("login-google-btn");
    fireEvent.click(googleLoginBtn);

    // 4. Modal closes and Avatar button is now visible in the header
    expect(screen.queryByRole("dialog", { name: /welcome to skillhouse/i })).not.toBeInTheDocument();
    const avatarBtn = screen.getByTestId("header-avatar-button");
    expect(avatarBtn).toBeInTheDocument();
    expect(screen.queryByTestId("header-get-started-btn")).not.toBeInTheDocument();

    // 5. Click Avatar -> opens UserMenuPopover
    fireEvent.click(avatarBtn);
    expect(screen.getByTestId("user-menu-popover")).toBeInTheDocument();

    // 6. Click Profile -> opens UserProfileModal
    const profileItem = screen.getByTestId("user-menu-item-profile");
    fireEvent.click(profileItem);
    expect(screen.getByTestId("user-profile-modal")).toBeInTheDocument();
    expect(screen.getByText("Alex Vance")).toBeInTheDocument();

    // Close profile modal
    const closeProfileBtn = screen.getByRole("button", { name: /close dialog/i });
    fireEvent.click(closeProfileBtn);
    expect(screen.queryByTestId("user-profile-modal")).not.toBeInTheDocument();

    // 7. Click Avatar -> click Help center -> opens HelpCenterModal
    fireEvent.click(avatarBtn);
    const helpItem = screen.getByTestId("user-menu-item-help");
    fireEvent.click(helpItem);
    expect(screen.getByTestId("help-center-modal")).toBeInTheDocument();

    const closeHelpBtn = screen.getByRole("button", { name: /^Close$/i });
    fireEvent.click(closeHelpBtn);
    expect(screen.queryByTestId("help-center-modal")).not.toBeInTheDocument();

    // 8. Sign out from user menu
    fireEvent.click(avatarBtn);
    const logoutBtn = screen.getByTestId("user-menu-item-logout");
    fireEvent.click(logoutBtn);
    expect(screen.getByTestId("header-get-started-btn")).toBeInTheDocument();
    expect(screen.queryByTestId("header-avatar-button")).not.toBeInTheDocument();
  });

  it("renders with external AuthProvider wrapper without re-wrapping", () => {
    render(
      <AuthProvider>
        <SkillDetailPage />
      </AuthProvider>
    );
    expect(screen.getByTestId("skill-detail-page")).toBeInTheDocument();
  });
  it("handles gallery slides, thumbnails, and similar carousel controls", () => {
    const handleBack = vi.fn();
    const handleNavigateSkill = vi.fn();
    render(
      <SkillDetailPage onBack={handleBack} onNavigateSkill={handleNavigateSkill} />
    );

    // 1. Gallery slide navigation
    const nextSlideBtn = screen.getByTestId("editorial-next-slide-btn");
    const prevSlideBtn = screen.getByTestId("editorial-prev-slide-btn");
    fireEvent.click(nextSlideBtn);
    fireEvent.click(prevSlideBtn);
    fireEvent.click(prevSlideBtn);

    // 2. Thumbnail tab selection
    const thumbTab = screen.getByTestId("thumbnail-tab-1");
    fireEvent.click(thumbTab);

    // 3. Similar carousel navigation
    const similarNextBtn = screen.getByTestId("similar-next-btn");
    const similarPrevBtn = screen.getByTestId("similar-prev-btn");
    fireEvent.click(similarNextBtn);
    fireEvent.click(similarPrevBtn);

    // 4. Back button
    const backBtn = screen.getByLabelText("Back to skills marketplace");
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);

    // 5. Similar skill card click
    const similarCards = screen.getAllByRole("article");
    if (similarCards.length > 0) {
      fireEvent.click(similarCards[0]);
      expect(handleNavigateSkill).toHaveBeenCalled();
    }
  });

  it("renders documentation tabs viewer and similar skills access badges", () => {
    render(<SkillDetailPage />);
    expect(screen.getByTestId("skill-doc-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("tab-overview-btn")).toBeInTheDocument();
    expect(screen.getByTestId("tab-skill-md-btn")).toBeInTheDocument();
    expect(screen.getByTestId("tab-reviews-btn")).toBeInTheDocument();

    const accessBadges = screen.getAllByTestId("skill-card-access-badge");
    expect(accessBadges.length).toBeGreaterThan(0);
    expect(accessBadges[0]).toHaveTextContent(/included in pass|free/i);
  });
});
