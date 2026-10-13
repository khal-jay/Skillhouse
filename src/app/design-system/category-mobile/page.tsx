"use client";

import React, { useState } from "react";
import { CategorySkillCard } from "@/components/features/CategorySkillCard";
import { CategorySkillGrid } from "@/components/features/CategorySkillGrid";

export default function CategoryMobilePage() {
  const [selectedCat, setSelectedCat] = useState<string>("");

  return (
    <div style={{ padding: "16px", backgroundColor: "#FFF1E1", minHeight: "100vh", maxWidth: "480px", margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-brand, #FB6320)" }}>
          Design System · Section 17
        </span>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#2D241E", margin: "4px 0 8px 0" }}>
          Category Skill Grid (Mobile View)
        </h1>
        <p style={{ color: "#7F776E", fontSize: "14px", lineHeight: "20px", margin: 0 }}>
          Mobile-responsive preview of individual interactive cards and the full joined vertical stack with connecting concave bridges.
        </p>
      </div>

      {/* 1. Single Cards Section */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#2D241E", marginBottom: "12px" }}>
          1. Single Card Variants
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <CategorySkillCard
            title={"Featured \nAgent Skills"}
            href="/skills?category=featured"
          />
          <CategorySkillCard
            title={"Trending \nAgent Skills"}
            href="/skills?category=trending"
          />
        </div>
      </section>

      {/* 2. Joined Stack Section */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#2D241E", margin: 0 }}>
            2. Joined Mobile Stack (With Bridges)
          </h2>
          {selectedCat && (
            <span style={{ fontSize: "12px", color: "#FB6320", fontWeight: 600 }}>
              Active: {selectedCat}
            </span>
          )}
        </div>
        <CategorySkillGrid onSelectCategory={(cat) => setSelectedCat(cat.id)} />
      </section>
    </div>
  );
}
