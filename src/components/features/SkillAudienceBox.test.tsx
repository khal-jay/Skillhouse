import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillAudienceBox } from "./SkillAudienceBox";

describe("Features SkillAudienceBox Component", () => {
  it("renders label, static role badges, and last updated date", () => {
    render(
      <SkillAudienceBox
        label="Audience"
        roles={["Designer", "Engineer"]}
        lastUpdated="Updated Oct 2026"
      />
    );
    expect(screen.getByText("Audience")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Updated Oct 2026")).toBeInTheDocument();
  });

  it("renders role badges as static non-button elements", () => {
    render(
      <SkillAudienceBox
        roles={["PM", "Founder"]}
      />
    );

    // Verify badges are not clickable buttons (no false affordance)
    expect(screen.queryByRole("button", { name: "PM" })).not.toBeInTheDocument();
    expect(screen.getByText("PM")).toBeInTheDocument();
    expect(screen.getByText("Founder")).toBeInTheDocument();
  });
});
