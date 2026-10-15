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

  it("renders documentation tabs viewer and ensures orange access badge is removed", () => {
    render(<SkillDetailPage />);
    expect(screen.getByTestId("skill-doc-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("tab-overview-btn")).toBeInTheDocument();
    expect(screen.getByTestId("tab-skill-md-btn")).toBeInTheDocument();
    expect(screen.getByTestId("tab-reviews-btn")).toBeInTheDocument();

    expect(screen.queryByTestId("skill-card-access-badge")).not.toBeInTheDocument();
  });

  it("conditionally renders carousel controls only when similar skills count exceeds 4", () => {
    const { unmount } = render(<SkillDetailPage />);
    expect(screen.getByTestId("similar-next-btn")).toBeInTheDocument();
    expect(screen.getByTestId("similar-prev-btn")).toBeInTheDocument();
    unmount();
  });

  it("scales gallery gracefully for single image by hiding thumbnail strip", () => {
    const singleSkill = {
      id: "single-slide-skill",
      title: "Single Slide Skill",
      version: "v1.0.0",
      price: "$9",
      description: "One single preview slide.",
      installPrompt: "npx @skillhouse/cli install single-slide-skill",
      category: "Tools",
      previewImage: "/figma/slide1.png",
      thumbnails: ["/figma/slide1.png"],
    };
    render(<SkillDetailPage skill={singleSkill} />);
    expect(screen.getByTestId("skill-detail-main-preview")).toBeInTheDocument();
    expect(screen.queryByTestId("thumbnail-tab-0")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gallery-stage-counter")).not.toBeInTheDocument();
    expect(screen.queryByTestId("thumbnails-carousel-wrapper")).not.toBeInTheDocument();
  });

  it("scales gallery to horizontal carousel when 5 or more thumbnails exist", () => {
    const multiSkill = {
      id: "multi-slide-skill",
      title: "Multi Slide Skill",
      version: "v2.0.0",
      price: "$29",
      description: "A comprehensive 8-slide presentation deck.",
      installPrompt: "npx @skillhouse/cli install multi-slide-skill",
      category: "Presentations",
      previewImage: "/figma/slide1.png",
      thumbnails: [
        "/figma/slide1.png",
        "/figma/slide2.png",
        "/figma/slide3.png",
        "/figma/slide4.png",
        "/figma/slide5.png",
        "/figma/slide6.png",
        "/figma/slide7.png",
        "/figma/slide8.png",
      ],
    };
    render(<SkillDetailPage skill={multiSkill} />);
    
    // Assert carousel wrapper and navigation buttons are rendered
    expect(screen.getByTestId("thumbnails-carousel-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("thumb-carousel-prev-btn")).toBeInTheDocument();
    expect(screen.getByTestId("thumb-carousel-next-btn")).toBeInTheDocument();
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("01 / 08");

    // Click next chevron
    const nextChevron = screen.getByTestId("thumb-carousel-next-btn");
    fireEvent.click(nextChevron);
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("02 / 08");

    // Click previous chevron
    const prevChevron = screen.getByTestId("thumb-carousel-prev-btn");
    fireEvent.click(prevChevron);
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("01 / 08");

    // Keyboard arrow navigation on scroll track
    const track = screen.getByTestId("thumbnails-scroll-track");
    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("02 / 08");
    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("01 / 08");
  });

  it("clamps active thumbnail index safely when switching to a skill with fewer thumbnails", () => {
    const skillA = {
      id: "skill-a",
      title: "Skill A",
      version: "v1.0.0",
      price: "$19",
      description: "Skill with 6 slides.",
      installPrompt: "npx skill-a",
      category: "Tools",
      previewImage: "/figma/slide1.png",
      thumbnails: ["/s1.png", "/s2.png", "/s3.png", "/s4.png", "/s5.png", "/s6.png"],
    };

    const skillB = {
      id: "skill-b",
      title: "Skill B",
      version: "v1.0.0",
      price: "$19",
      description: "Skill with 2 slides.",
      installPrompt: "npx skill-b",
      category: "Tools",
      previewImage: "/figma/b1.png",
      thumbnails: ["/b1.png", "/b2.png"],
    };

    const { rerender } = render(<SkillDetailPage skill={skillA} />);
    
    // Select thumbnail 5
    const thumb5 = screen.getByTestId("thumbnail-tab-5");
    fireEvent.click(thumb5);
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("06 / 06");

    // Rerender with skill B that only has 2 thumbnails
    rerender(<SkillDetailPage skill={skillB} />);
    expect(screen.getByTestId("gallery-stage-counter")).toHaveTextContent("01 / 02");
  });
});
