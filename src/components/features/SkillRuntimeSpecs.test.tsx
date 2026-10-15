import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillRuntimeSpecs } from "./SkillRuntimeSpecs";

describe("Features SkillRuntimeSpecs Component", () => {
  it("renders logos and static spec badges for guides and generators", () => {
    render(
      <SkillRuntimeSpecs
        installGuides={["Claude Code", "Cursor"]}
        generatesWith={["Host Agent LLM"]}
      />
    );
    expect(screen.getByText("Runs in")).toBeInTheDocument();
    expect(screen.getByText("Install guides")).toBeInTheDocument();
    expect(screen.getByText("Generates with")).toBeInTheDocument();
    
    // Verify badges are not clickable buttons (no false affordance)
    expect(screen.queryByRole("button", { name: "Claude Code" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Host Agent LLM" })).not.toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
    expect(screen.getByText("Host Agent LLM")).toBeInTheDocument();
  });
});
