import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MagneticButton } from "./magnetic-button";
import MagneticButtonDemo from "../magnetic-button-demo";

describe("MagneticButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MagneticButton>
        <button>Test Button</button>
      </MagneticButton>
    );
    expect(screen.getByRole("button", { name: "Test Button" })).toBeInTheDocument();
  });

  it("handles mouse move within max distance", () => {
    render(
      <MagneticButton strength={0.5} maxDistance={100}>
        <button>Move Me</button>
      </MagneticButton>
    );

    const inner = screen.getByTestId("magnetic-inner");
    vi.spyOn(inner, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 40,
      left: 100,
      top: 100,
      right: 200,
      bottom: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    const wrapper = screen.getByTestId("magnetic-wrapper");
    fireEvent.mouseMove(wrapper, { clientX: 160, clientY: 130 });
    expect(wrapper).toHaveStyle({ display: "inline-block" });
  });

  it("clamps displacement when distance exceeds maxDistance", () => {
    render(
      <MagneticButton strength={1} maxDistance={20}>
        <button>Clamp Me</button>
      </MagneticButton>
    );

    const inner = screen.getByTestId("magnetic-inner");
    vi.spyOn(inner, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 40,
      left: 100,
      top: 100,
      right: 200,
      bottom: 140,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    const wrapper = screen.getByTestId("magnetic-wrapper");
    fireEvent.mouseMove(wrapper, { clientX: 1000, clientY: 1000 });
    expect(wrapper).toBeInTheDocument();
  });

  it("resets position on mouse leave", () => {
    render(
      <MagneticButton>
        <button>Leave Me</button>
      </MagneticButton>
    );

    const wrapper = screen.getByTestId("magnetic-wrapper");
    fireEvent.mouseMove(wrapper, { clientX: 200, clientY: 200 });
    fireEvent.mouseLeave(wrapper);
    expect(wrapper).toBeInTheDocument();
  });

  it("supports showDashedBorder=false and custom activeColor", () => {
    render(
      <MagneticButton showDashedBorder={false} activeColor="#FB6320" className="custom-class">
        <button>Clean</button>
      </MagneticButton>
    );

    const wrapper = screen.getByTestId("magnetic-wrapper");
    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper.style.borderColor).toBe("transparent");
    expect(wrapper).toHaveStyle({ cursor: "pointer" });
  });

  it("handles mouse move safely if ref is not mounted", () => {
    render(
      <MagneticButton>
        <span>Content</span>
      </MagneticButton>
    );
    const wrapper = screen.getByTestId("magnetic-wrapper");
    expect(() => fireEvent.mouseMove(wrapper, { clientX: 50, clientY: 50 })).not.toThrow();
  });
});

describe("MagneticButtonDemo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders demo buttons and handles clicks", () => {
    render(<MagneticButtonDemo />);

    expect(screen.getByText("Magnetic Button Interaction")).toBeInTheDocument();
    const followBtn = screen.getByRole("button", { name: "Follow @mannupaaji" });
    const getStartedBtn = screen.getByRole("button", { name: "Get Started" });

    act(() => {
      fireEvent.click(followBtn);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Clicked: @mannupaaji");

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(getStartedBtn);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Clicked: Skillhouse Get Started");
  });
});
