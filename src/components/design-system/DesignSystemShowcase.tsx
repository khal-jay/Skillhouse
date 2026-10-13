import { MySkillsWorkspace } from "../features/MySkillsWorkspace/MySkillsWorkspace";
"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { BookmarkButton } from "../ui/BookmarkButton";
import { Copy, Download, Upload, Archive, Globe, Code2, Palette, Sparkles } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from "../primitives/Select";
import { Checkbox } from "../ui/Checkbox";
import { SearchInput } from "../ui/SearchInput";
import { Pill } from "../ui/Pill";
import { SubscriptionBanner } from "../ui/SubscriptionBanner";
import { FilterItem } from "../features/FilterItem";
import { FilterSection } from "../features/FilterSection";
import { SkillCard } from "../features/SkillCard";
import { AdCard } from "../features/AdCard";
import { SkillAudienceBox } from "../features/SkillAudienceBox";
import { SkillRuntimeSpecs } from "../features/SkillRuntimeSpecs";
import { SkillDetailHeader } from "../features/SkillDetailHeader";
import { NavBar } from "../features/NavBar";
import { CategoriesDropdown } from "../features/CategoriesDropdown";
import { LoginModal } from "../features/LoginModal";
import { UserMenuPopover } from "../features/UserMenuPopover";
import { CategorySkillCard } from "../features/CategorySkillCard";
import { CategorySkillGrid } from "../features/CategorySkillGrid";

import { ConnectAgentBanner } from "../features/ConnectAgentBanner";
import { useScrollLock } from "../../lib/useScrollLock";
import styles from "./DesignSystemShowcase.module.css";

export const DesignSystemShowcase: React.FC = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [demoShowcaseBookmarked, setDemoShowcaseBookmarked] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [demoSelectVal, setDemoSelectVal] = useState("Development & coding");
  const [demoSearchableSelectVal, setDemoSearchableSelectVal] = useState("Claude Code Agent");
  const [demoRichSelectVal, setDemoRichSelectVal] = useState("web-surfer");
  const [cb1, setCb1] = useState(false);
  const [cb2, setCb2] = useState(true);
  const [demoPillSelected, setDemoPillSelected] = useState<string>("Claude Code");
  const [demoBannerClicked, setDemoBannerClicked] = useState(false);
  const [demoLoginModalOpen, setDemoLoginModalOpen] = useState(false);
  const [demoDropdownTab, setDemoDropdownTab] = useState<"use-case" | "role" | "output">("use-case");
  const [demoDropdownOverlayOpen, setDemoDropdownOverlayOpen] = useState(false);
  useScrollLock(demoDropdownOverlayOpen);
  const [demoNavSignedIn, setDemoNavSignedIn] = useState(false);
  const [demoUserMenuVariant, setDemoUserMenuVariant] = useState<"attending" | "extended">("attending");
  const [demoUserMenuActiveItem, setDemoUserMenuActiveItem] = useState<string>("bookmarks");
    const [demoWorkspaceSavedIds, setDemoWorkspaceSavedIds] = useState<string[]>([
    "visual-canvas-deck",
    "pixel-promo-video",
  ]);
  const [demoUserMenuFeedback, setDemoUserMenuFeedback] = useState<string | null>(null);
  const [cbAllSkills, setCbAllSkills] = useState(true);
  const [filterActive, setFilterActive] = useState<Record<string, boolean>>({
    web: true,
    slides: false,
    video: false,
    image: true,
  });

  const toggleFilter = (key: string) => {
    setFilterActive((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const orangeTokens = [
    { name: "Brand Orange (Core)", hex: "#FB6320", desc: "Signature brand CTA, checked checkbox, links, active rings", var: "--color-brand" },
    { name: "Brand Hover", hex: "#E05215", desc: "Interactive hover for buttons and active states", var: "--color-brand-hover" },
    { name: "Brand Light (Banner Subtext)", hex: "#FFE3D7", desc: "Figma node 725:11285 banner subtext", var: "--color-brand-light" },
    { name: "Brand Subtle Tint", hex: "#FFF4EE", desc: "Active row highlight & verified chip fill", var: "--color-brand-subtle" },
    { name: "Surface Cream (Search Box)", hex: "#FFECD8", desc: "Figma node 694:4030 input background", var: "--color-surface-cream" },
    { name: "Surface Peach (Avatars)", hex: "#FBE1C7", desc: "Figma node 673:2956 model logomark background", var: "--color-surface-peach" },
  ];

    const spacingScaleTokens = [
    { token: "--space-3xs", value: "4px", multiplier: "0.5x", px: 4, usage: "Model avatars overlap (752:11312), chevron/category gap (744:1080), banner header gap (752:11150)" },
    { token: "--space-2xs", value: "6px", multiplier: "0.75x", px: 6, usage: "Stat item icon-to-label gap (752:11256), info link icon gap (752:11287), checkbox vertical padding (673:2298)" },
    { token: "--space-xs", value: "8px", multiplier: "1x (Base)", px: 8, usage: "Round button padding (752:11251), pill tag padding (752:11295), audience label gap (752:11292), checkbox row gap (673:2298)" },
    { token: "--space-sm", value: "10px", multiplier: "1.25x", px: 10, usage: "Primary action button group gap (752:11275, 752:11154), round icon buttons gap (752:11250)" },
    { token: "--space-md", value: "12px", multiplier: "1.5x", px: 12, usage: "Audience pills gap (752:11294), runtime install guide pills gap (752:11346), button vertical padding (EL-18198c27)" },
    { token: "--space-lg", value: "16px", multiplier: "2x", px: 16, usage: "Audience & runtime box padding/gap (752:11291, 752:11309), orange banner padding/gap (752:11137), meta row gap (752:11255), description gap (752:11285)" },
    { token: "--space-xl", value: "24px", multiplier: "3x", px: 24, usage: "Root composite panel gap (752:11245, 752:11109), button horizontal padding, nav links gap (744:1077), mega menu padding (750:3470)" },
    { token: "--space-2xl", value: "32px", multiplier: "4x", px: 32, usage: "Major layout section gap, header content gap (744:1063), modal inner padding (4621:371148)" },
    { token: "--space-3xl", value: "40px", multiplier: "5x", px: 40, usage: "Header desktop horizontal padding (744:1063), container edge spacing" },
    { token: "--space-4xl", value: "48px", multiplier: "6x", px: 48, usage: "Wide runtime specs row gap between fixed label & logomarks (752:11310)" },
  ];

  const structuralDimensionTokens = [
    { token: "--dim-panel-width", value: "437px", usage: "Composite Skill Detail Action Panel width (Figma nodes 752:11245 & 752:11109)" },
    { token: "--dim-btn-action", value: "48px", usage: "Primary action button height for 'Copy install prompt' & 'Download ZIP' (layout_18198c27)" },
    { token: "--dim-spec-label", value: "97px", usage: "Fixed category label column width in runtime specs (layout_630da271)" },
    { token: "--dim-btn-round", value: "28px", usage: "Circular bookmark & share icon button diameter (EL-e8dd6c0d)" },
    { token: "--dim-pill-height", value: "28px", usage: "Peach audience & install guide pill component height (EL-d7837055)" },
    { token: "--dim-avatar-spec", value: "28px", usage: "Circular model logomark avatar in runs-in specs (EL-53eec184)" },
    { token: "--dim-icon-md", value: "16px", usage: "Primary action button icon size (copy/import) (752:11278) & banner chevron (752:11153)" },
    { token: "--dim-icon-sm", value: "14px", usage: "Stat strip icons (752:11257) & circular action button icons (752:11252)" },
    { token: "--dim-icon-xs", value: "12px", usage: "Info-circle license helper icon (752:11288)" },
  ];

  const neutralTokens = [
    { name: "Dark / Black", hex: "#000000", desc: "Primary black button, display titles, borders", var: "--color-dark" },
    { name: "Dark Hover", hex: "#1C1C1E", desc: "Hover state for black buttons and active body text", var: "--color-dark-hover" },
    { name: "Text Secondary", hex: "#464646", desc: "Nav items, search placeholder, label body", var: "--color-text-secondary" },
    { name: "Text Muted", hex: "#7F776E", desc: "Version labels, descriptions, subheadings", var: "--color-text-muted" },
    { name: "Text Tertiary", hex: "#9B9B9B", desc: "Item count badges (387, 113, 47, 144, 83)", var: "--color-text-tertiary" },
    { name: "Border Regular", hex: "rgba(166, 166, 166, 0.5)", desc: "Inputs, cards, and panel dividers", var: "--color-border" },
  ];

  return (
    <div className={styles.container}>
      {/* 1. Header Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Skillhouse Design System</h1>
        <p className={styles.heroSubtitle}>
          Living component library, token specifications, and interactive testing workbench
          powered by the official <strong>Geist Pixel Square</strong> font and Figma signature palette (File: <code>cenkXrTeBinliSZvWjPDZX</code>).
        </p>
        <div className={styles.metaInfo}>
          <span className={styles.metaPill}>Font: Geist Pixel Square (.ttf)</span>
          <span className={styles.metaPill}>Signature Accent: #FB6320</span>
          <span className={styles.metaPill}>10-Step Empirical Spacing Scale</span>
          <span className={styles.metaPill}>14 Canvas Nodes Mapped</span>
        </div>
      </section>

      {/* 2. Signature Orange System */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            01. Signature Orange Palette System
            <span className={styles.nodeBadge}>#FB6320 Scale</span>
          </h2>
          <p className={styles.sectionDesc}>
            The primary brand identifier across CTA buttons (Node 671:8317), subscription banner (Node 725:11270),
            checkbox active fills (Node 673:2299), copy prompt borders (Node 725:11313), and cream/peach surfaces.
          </p>
        </div>

        <div className={styles.colorGrid}>
          {orangeTokens.map((c, i) => (
            <div key={i} className={styles.colorCard}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: c.hex }}
              />
              <div className={styles.colorDetails}>
                <span className={styles.colorName}>{c.name}</span>
                <span className={styles.colorHex}>{c.hex}</span>
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  {c.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Neutrals & Surface Scale */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>02. Neutrals & Surface Tokens</h2>
          <p className={styles.sectionDesc}>
            Monochromatic foundation for high-contrast legible product surfaces.
          </p>
        </div>

        <div className={styles.colorGrid}>
          {neutralTokens.map((c, i) => (
            <div key={i} className={styles.colorCard}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: c.hex.startsWith("rgba") ? "#D9D9D9" : c.hex }}
              />
              <div className={styles.colorDetails}>
                <span className={styles.colorName}>{c.name}</span>
                <span className={styles.colorHex}>{c.hex}</span>
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  {c.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Geist Pixel Square Typography */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            03. Typography — Geist Pixel Square & Geist Sans
            <span className={styles.nodeBadge}>GeistPixel-Square.ttf</span>
          </h2>
          <p className={styles.sectionDesc}>
            Loaded directly from the authentic <code>GeistPixel-Square.ttf</code> binary for crisp pixel aesthetics.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div className={styles.typeSampleRow}>
            <span className="font-pixel" style={{ fontSize: "28px" }}>
              Visual Canvas Deck $5
            </span>
            <span className={styles.typeMeta}>Geist Pixel Square / 28px (Node 725:11241 & 725:11265)</span>
          </div>

          <div className={styles.typeSampleRow}>
            <span className="font-pixel" style={{ fontSize: "16px" }}>
              Subscribe — All Skills, one subscription
            </span>
            <span className={styles.typeMeta}>Geist Pixel Square / 16px (Node 725:11284)</span>
          </div>

          <div className={styles.typeSampleRow}>
            <span className="font-pixel" style={{ fontSize: "14px" }}>
              Pixel Promo Video · v2.3.0
            </span>
            <span className={styles.typeMeta}>Geist Pixel Square / 14px</span>
          </div>

          <div className={styles.typeSampleRow}>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              Navigation Links & Body Headers
            </span>
            <span className={styles.typeMeta}>Geist Sans / 16px / Medium 500</span>
          </div>

          <div className={styles.typeSampleRow}>
            <span style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              Search skills / outputs (Placeholder & input body)
            </span>
            <span className={styles.typeMeta}>Geist Sans / 14px / Regular 400</span>
          </div>

          <div className={styles.typeSampleRow}>
            <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
              Counts and Metadata (387, 113, 47, v1.0.1)
            </span>
            <span className={styles.typeMeta}>Geist Sans / 12px / Regular 400</span>
          </div>
        </div>
      </section>

      {/* 4. Empirical Spacing Scale & Structural Dimensions */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            04. Empirical Spacing Scale &amp; Structural Dimensions
            <span className={styles.nodeBadge}>Concatenated Across All Figma Nodes</span>
          </h2>
          <p className={styles.sectionDesc}>
            Unified spacing scale and fixed structural dimensions distilled from repeated metrics across all inspected Figma nodes (<code>meyaj2</code> nodes 752:11245, 752:11109, 744:1024, 750:3470, 673:2298 and <code>IsangAI</code> nodes 4621:371148, 4597:367764).
          </p>
        </div>

        <div className={styles.sandboxCard} style={{ gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 12px 0", color: "var(--color-dark)" }}>
              A. Core Spacing Scale (--space-*)
            </h3>
            <div className={styles.spacingTableWrapper}>
              <table className={styles.spacingTable}>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Value</th>
                    <th>Scale Multiplier</th>
                    <th>Visual Bar</th>
                    <th>Observed Figma Node Usages</th>
                  </tr>
                </thead>
                <tbody>
                  {spacingScaleTokens.map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        <code className={styles.spacingTokenCode}>{s.token}</code>
                      </td>
                      <td>
                        <span className={styles.spacingVal}>{s.value}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{s.multiplier}</span>
                      </td>
                      <td>
                        <div className={styles.spacingBarContainer}>
                          <div
                            className={styles.spacingBar}
                            style={{ width: (s.px * 3) + "px" }}
                          />
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{s.value}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{s.usage}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 12px 0", color: "var(--color-dark)" }}>
              B. Structural Component Dimensions (--dim-*)
            </h3>
            <div className={styles.dimGrid}>
              {structuralDimensionTokens.map((d, idx) => (
                <div key={idx} className={styles.dimCard}>
                  <div className={styles.dimHeader}>
                    <span className={styles.dimToken}>{d.token}</span>
                    <span className={styles.dimVal}>{d.value}</span>
                  </div>
                  <p className={styles.dimUsage}>{d.usage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Button Primitives */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            05. Button Primitives
            <span className={styles.nodeBadge}>Nodes 673:15 & 671:8317</span>
          </h2>
          <p className={styles.sectionDesc}>
            Primary Dark (#000000), Brand Orange (#FB6320), Outlines, and Icon actions with press feedback (scale 0.96) and loading states.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          {/* Variants */}
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Primary Dark (673:15)</span>
            <Button variant="primary" size="md">
              Get started
            </Button>
            <Button variant="primary" size="lg">
              Buy now ($5)
            </Button>
          </div>

          {/* Brand Accent */}
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Brand Orange (671:8317)</span>
            <Button variant="brand" size="md">
              See all Skills
            </Button>
            <Button variant="brand" size="lg">
              Explore Library →
            </Button>
          </div>

          {/* Outlines */}
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Outlines (725:11313)</span>
            <Button
              variant="outline-brand"
              size="md"
              leftIcon={<Copy size={16} />}
            >
              Copy install prompt
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download size={16} />}
            >
              Download ZIP
            </Button>
          </div>

          {/* Interactive States */}
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>State Controls</span>
            <Button
              variant="brand"
              size="md"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 2000);
              }}
            >
              Click for Loading State
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled State
            </Button>
            <Button variant="icon-border" size="icon-sm" title="Upload action">
              <Upload size={14} />
            </Button>
            <Button variant="icon-border" size="icon-sm" title="Archive action">
              <Archive size={14} />
            </Button>
          </div>

          {/* Fully Rounded Action Buttons */}
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Fully Rounded Bookmark Buttons (Nodes 751:5617 & 673:3035)</span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <BookmarkButton
                size="md"
                variant="cream"
                isBookmarked={demoShowcaseBookmarked}
                onToggle={setDemoShowcaseBookmarked}
                title="Toggle bookmark (Cream / 28px circular)"
              />
              <BookmarkButton
                size="sm"
                variant="white"
                isBookmarked={demoShowcaseBookmarked}
                onToggle={setDemoShowcaseBookmarked}
                title="Toggle bookmark (White / 26px circular)"
              />
              <BookmarkButton
                size="md"
                variant="cream"
                isBookmarked={true}
                title="Active Bookmarked State (Brand Orange)"
              />
              <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Always 100% circular (border-radius: 50%) across all instantiations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Search Input Component */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            06. Search Input Field
            <span className={styles.nodeBadge}>Node 694:4027</span>
          </h2>
          <p className={styles.sectionDesc}>
            Input with search-normal icon, subtle warm cream background (#FFECD8) or white variant, clear button, and focus ring.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div style={{ maxWidth: "340px" }}>
            <span className={styles.stateLabel}>Figma Cream Variant</span>
            <div style={{ marginTop: "8px" }}>
              <SearchInput
                variant="cream"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onClear={() => setSearchVal("")}
                placeholder="Search skills / outputs"
              />
            </div>
          </div>

          <div style={{ maxWidth: "340px" }}>
            <span className={styles.stateLabel}>White Surface Variant</span>
            <div style={{ marginTop: "8px" }}>
              <SearchInput
                variant="white"
                placeholder="Search skills / outputs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 06b. Select Primitive — Custom Dropdown, Rich Context & Edge Cases */}
      <section className={styles.section} id="select-primitive">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            06b. Select Primitive (Custom Dropdown & Edge Cases)
            <span className={styles.nodeBadge}>Nodes 751:7385, 760:12903</span>
          </h2>
          <p className={styles.sectionDesc}>
            Reusable Design System Select primitive with rich context, collision-detection auto-flip, mobile bottom-sheet drawer, search filtering, typeahead, option groups, clearable action, and WCAG 2.5.5 touch compliance.
          </p>
        </div>

        {/* Row 1: Interactive Standard & Searchable / Clearable */}
        <div className={styles.sandboxCard} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <div>
            <span className={styles.stateLabel}>Controlled Standard Select</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-controlled"
                value={demoSelectVal}
                onValueChange={setDemoSelectVal}
                options={[
                  "Development & coding",
                  "Design & creative",
                  "Writing & content",
                  "Research & analysis",
                  "Business & productivity",
                ]}
                placeholder="Choose category"
              />
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#7F776E" }}>
              Selected: <strong style={{ color: "#FB6320" }}>{demoSelectVal || "None"}</strong>
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Searchable & Clearable Select</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-searchable"
                searchable
                isClearable
                value={demoSearchableSelectVal}
                onValueChange={setDemoSearchableSelectVal}
                options={[
                  "Claude Code Agent",
                  "Cursor Agent",
                  "Windsurf Cascade",
                  "Codex CLI",
                  "OpenAI Operator",
                  "Perplexity Computer",
                ]}
                placeholder="Search agent target..."
              />
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#7F776E" }}>
              Filter by name or clear with (X)
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Compound Groups, Icons & Subtitles</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-compound"
                value={demoRichSelectVal}
                onValueChange={setDemoRichSelectVal}
                placeholder="Select specialized tool"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialized tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Automation Agents</SelectLabel>
                    <SelectItem
                      value="web-surfer"
                      icon={<Globe size={15} />}
                      description="Automates headless web extraction"
                    >
                      Web Surfer
                    </SelectItem>
                    <SelectItem
                      value="code-auditor"
                      icon={<Code2 size={15} />}
                      description="Validates type safety & accessibility"
                    >
                      Code Auditor
                    </SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Creative Engines</SelectLabel>
                    <SelectItem
                      value="canvas-artist"
                      icon={<Palette size={15} />}
                      description="Generates Figma tokens & design specs"
                    >
                      Canvas Artist
                    </SelectItem>
                    <SelectItem
                      value="prompt-synth"
                      icon={<Sparkles size={15} />}
                      description="Synthesizes multi-shot agent prompts"
                    >
                      Prompt Synthesizer
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#7F776E" }}>
              Selected: <strong style={{ color: "#FB6320" }}>{demoRichSelectVal || "None"}</strong>
            </div>
          </div>
        </div>

        {/* Row 2: Edge Cases & Size Variants */}
        <div className={styles.sandboxCard} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "16px" }}>
          <div>
            <span className={styles.stateLabel}>Small Size (32px)</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-sm"
                size="sm"
                options={["Small Compact A", "Small Compact B", "Small Compact C"]}
                defaultValue="Small Compact A"
              />
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Large Size (48px)</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-lg"
                size="lg"
                options={["Large Prominent Option 1", "Large Prominent Option 2"]}
                defaultValue="Large Prominent Option 1"
              />
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Validation Error State</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-error"
                error
                options={["Option Requires Selection", "Valid Option"]}
                placeholder="Invalid selection..."
              />
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Disabled State & Disabled Items</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-disabled"
                disabled
                options={["Locked Option", "Cannot change"]}
                defaultValue="Locked Option"
              />
            </div>
          </div>

          <div>
            <span className={styles.stateLabel}>Async Loading State</span>
            <div style={{ marginTop: "8px" }}>
              <Select
                id="ds-select-loading"
                isLoading
                options={[]}
                placeholder="Fetching remote models..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Checkbox & Filter Items */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            07. Checkbox & Filter Items
            <span className={styles.nodeBadge}>Nodes 673:226, 673:228, 673:2316, 673:2327</span>
          </h2>
          <p className={styles.sectionDesc}>
            Custom 18px checkbox primitive with smooth animated checkmark and composite FilterItem with category icons and count badges.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Raw Checkboxes & Node 673:2298</span>
          <div style={{ padding: "8px 0", maxWidth: "260px" }}>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "block", marginBottom: "4px" }}>
              Exact Node 673:2298 (24x24px, #FB6320 fill, space-between count):
            </span>
            <FilterItem
              id="demo-all-skills"
              label="All skills"
              count="387"
              checked={cbAllSkills}
              onChange={(val) => setCbAllSkills(val)}
            />
          </div>
            <Checkbox
              label="Unchecked Default"
              checked={cb1}
              onChange={(e) => setCb1(e.target.checked)}
            />
            <Checkbox
              label="Checked Default (#FB6320)"
              checked={cb2}
              onChange={(e) => setCb2(e.target.checked)}
            />
            <Checkbox
              label="Disabled"
              checked={false}
              disabled
            />
          </div>

          <div style={{ maxWidth: "260px", marginTop: "16px" }}>
            <span className={styles.stateLabel}>Filter Group (673:2316)</span>
            <div style={{ marginTop: "12px" }}>
              <FilterSection title="By output" defaultOpen={true} showDivider={false}>
                <FilterItem
                  id="demo-web"
                  label="Web"
                  count={113}
                  iconName="monitor"
                  checked={filterActive.web}
                  onChange={() => toggleFilter("web")}
                />
                <FilterItem
                  id="demo-slides"
                  label="Slides"
                  count={47}
                  iconName="presentation"
                  checked={filterActive.slides}
                  onChange={() => toggleFilter("slides")}
                />
                <FilterItem
                  id="demo-video"
                  label="Video"
                  count={144}
                  iconName="video"
                  checked={filterActive.video}
                  onChange={() => toggleFilter("video")}
                />
                <FilterItem
                  id="demo-image"
                  label="Image"
                  count={83}
                  iconName="image"
                  checked={filterActive.image}
                  onChange={() => toggleFilter("image")}
                />
              </FilterSection>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Skill Card Component (Node 673:3035) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            08. Skill Card Grid Item
            <span className={styles.nodeBadge}>Node 673:3035 (skill - grid)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Exact Figma tree: 200px cover image with sharp 0px corners, title in Geist 16px Regular, and -5px overlapping circular model badges (20x20px, #FBE1C7, 0.167px border).
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            <SkillCard
              id="card-1"
              title="Pixel Promo Video"
              category="Video"
              previewImage="/figma/skill-card-preview.png"
              onClick={() => alert("Opened Pixel Promo Video")}
            />
            <SkillCard
              id="card-2"
              title="Visual Canvas Deck"
              category="Slides"
              previewImage="/figma/skill-card-preview.png"
              onClick={() => alert("Opened Visual Canvas Deck")}
            />
            <AdCard
              id="ad-1"
              title="Deploy Skills with Vercel"
              description="Deploy AI agent skills in seconds with zero configuration."
              badgeLabel="Sponsored"
              ctaText="Start Free"
              onClick={() => alert("Ad clicked: Vercel")}
            />
          </div>
        </div>
      </section>

      {/* 9. Target Audience Box (Node 725:11328) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            09. Skill Audience Container
            <span className={styles.nodeBadge}>Node 725:11328 (often used by)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Exact Figma tree: 16px padding, 16px gap, 1px border (rgba(166, 166, 166, 0.5)), sharp 0px radius, Geist 14px muted label, warm peach pills (height 28px, fill rgba(255, 236, 217, 0.7)), 1px divider, and updated date.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div style={{ maxWidth: "480px", width: "100%" }}>
            <SkillAudienceBox
              label="This skill is often used by"
              roles={["Product Manager", "Graphic Designer", "Art Director"]}
              lastUpdated="Last updated Oct 3, 2026"
            />
          </div>
        </div>
      </section>

      {/* 10. Skill Runtime & Guide Specs (Node 725:11346) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            10. Skill Runtime & Environment Specs
            <span className={styles.nodeBadge}>Node 725:11346 (runs in)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Exact Figma tree: 3 spec rows with 97px fixed labels, 48px gap, 6 circular 28x28px runtime avatars (#FBE1C7, radius 42px), horizontal divider, and sharp 28px peach install guide pills.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div style={{ maxWidth: "480px", width: "100%" }}>
            <SkillRuntimeSpecs
              runsInModels={[
                "/figma/logo-1.png",
                "/figma/logo-2.png",
                "/figma/logo-3.png",
                "/figma/logo-4.png",
                "/figma/logo-5.png",
                "/figma/logo-6.png",
              ]}
              installGuides={["Claude Code", "Cursor"]}
              generatesWith={["Host Agent LLM"]}
            />
          </div>
        </div>
      </section>

      {/* 11. Peach Pill Primitive (Template EL-d7837055) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            11. Peach Pill / Tag Primitive
            <span className={styles.nodeBadge}>Template EL-d7837055 (sort-select)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Reusable interactive pill: height 28px, sharp 0px border-radius, background rgba(255, 236, 217, 0.7), 1px border rgba(166, 166, 166, 0.5), Geist 14px regular font, and active selection state.
          </p>
        </div>

        <div className={styles.sandboxCard}>
          <div className={styles.sandboxRow}>
            <span className={styles.stateLabel}>Interactive Pills</span>
            {["Claude Code", "Cursor", "Product Manager", "Host Agent LLM"].map((pill) => (
              <Pill
                key={pill}
                isSelected={demoPillSelected === pill}
                onClick={() => setDemoPillSelected(pill)}
              >
                {pill}
              </Pill>
            ))}
          </div>
        </div>
      </section>

      {/* 11b. Subscription Banner Primitive (Figma Node 751:5654 "add journey") */}
      <section className={styles.section} id="subscription-banner">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            11b. Subscription Banner Component
            <span className={styles.nodeBadge}>Figma Node 751:5654 (&quot;add journey&quot;)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Dedicated monetization banner with signature solid <code>#FB6320</code> background, <code>16px</code> padding, sharp <code>0px</code> corners, horizontal flex layout with Geist Pixel Square title (16px), Geist subtitle (13px #FFE3D7), and centered 16x16px Line arrow-right with <code>scale(0.96)</code> active micro-interaction.
          </p>
        </div>

        <div className={styles.sandboxCard} style={{ flexDirection: "column", gap: "20px" }}>
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <span className={styles.stateLabel} style={{ marginBottom: "8px", display: "block" }}>
              Standard State (Figma Node 751:5654)
            </span>
            <SubscriptionBanner
              onSubscribe={() => setDemoBannerClicked((prev) => !prev)}
            />
          </div>

          <div style={{ width: "100%", maxWidth: "480px" }}>
            <span className={styles.stateLabel} style={{ marginBottom: "8px", display: "block" }}>
              Subscribed State (Active Member)
            </span>
            <SubscriptionBanner
              isSubscribed={true}
              onSubscribe={() => alert("All-access pass is already active!")}
            />
          </div>

          {demoBannerClicked && (
            <p style={{ fontSize: "12px", color: "var(--color-brand)", margin: 0, fontWeight: 500 }}>
              Subscription banner clicked — checkout sheet opened.
            </p>
          )}
        </div>
      </section>

      {/* 12. Composite Skill Detail Action Panel & States (Nodes 752:11245 & 752:11109) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            12. Composite Skill Detail Action Panel &amp; States
            <span className={styles.nodeBadge}>Component 219 (Nodes 752:11245 &amp; 752:11109)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Master action panel matching Component 219 specs: exact <code>437px</code> panel width, <code>24px</code> root section gap (<code>--space-xl</code>), Geist Pixel Square title (28px 1em), 28x28px circular bookmark/share actions, 4-stat meta row (295, 295, v1.0.1, Secure), 10px action button gap with 48px height, 1px divider, audience container, and runtime specs.
          </p>
        </div>

        <div className={styles.stateComparisonGrid}>
          {/* State 1: Free Skill (Figma Node 752:11245 - Property 1=free) */}
          <div className={styles.sandboxCard} style={{ flexDirection: "column", alignItems: "stretch", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", paddingBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-dark)" }}>
                Variant 1: Free Skill (Node 752:11245)
              </span>
              <span className={styles.nodeBadge} style={{ margin: 0 }}>
                Property 1=free · Geist Pixel &quot;Free&quot; (20px)
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>
              Renders Geist Pixel Square &quot;Free&quot; price text with zero subscription banner. Immediate install and download actions.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SkillDetailHeader
                title="Visual Canvas Deck"
                version="v1.0.1"
                price="Free"
                isFree={true}
                variant="free"
                description="This skill generates stunning visual canvas decks using react-canvas and Tailwind CSS for rapid prototyping."
              />
            </div>
          </div>

          {/* State 2: Premium Skill (Figma Node 752:11109 - Property 1=premium) */}
          <div className={styles.sandboxCard} style={{ flexDirection: "column", alignItems: "stretch", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", paddingBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-dark)" }}>
                Variant 2: Premium Skill (Node 752:11109)
              </span>
              <span className={styles.nodeBadge} style={{ margin: 0 }}>
                Property 1=premium · #FB6320 All-Access Banner
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: 0 }}>
              Renders the signature #FB6320 orange subscription banner (&quot;Subsribe - All Skills, one subscription&quot;) with zero standalone price label.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SkillDetailHeader
                title="Visual Canvas Deck"
                version="v1.0.1"
                price="$5"
                isFree={false}
                variant="premium"
                description="This skill generates stunning visual canvas decks using react-canvas and Tailwind CSS for rapid prototyping."
              />
            </div>
          </div>
        </div>
      </section>
      {/* 12. Header Nav Responsive & Interactive States (Nodes 744:1024, 4626:372065, 753:11852) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            13. Header Nav Responsive &amp; Interactive States
            <span className={styles.nodeBadge}>Nodes 744:1024, 4626:372065, 753:11852</span>
          </h2>
          <p className={styles.sectionDesc}>
            Comprehensive showcase of the Header Navigation across all responsive viewport states and interactive user conditions.
          </p>
        </div>

        <div className={styles.sandboxCard} style={{ flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <Button
              variant="brand"
              size="sm"
              onClick={() => setDemoLoginModalOpen(true)}
            >
              Open Live Login Modal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDemoNavSignedIn(!demoNavSignedIn)}
            >
              Toggle Auth State: {demoNavSignedIn ? "Signed In (Figma 4626:372065)" : "Default / Guest (Figma 744:1024)"}
            </Button>
          </div>

          {/* State 1: Desktop Guest View */}
          <div style={{ width: "100%", border: "1px solid var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "8px 16px", background: "var(--color-surface-cream)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600 }}>State 1: Desktop Guest View (Figma 744:1024)</span>
              <span style={{ fontSize: "11px", color: "#7F776E" }}>Desktop &gt; 992px • Get started CTA • Search bar</span>
            </div>
            <NavBar
              isSignedIn={false}
              onOpenLoginModal={() => setDemoLoginModalOpen(true)}
              onGetStarted={() => setDemoLoginModalOpen(true)}
            />
          </div>

          {/* State 2: Desktop Signed In View */}
          <div style={{ width: "100%", border: "1px solid var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "8px 16px", background: "var(--color-surface-cream)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600 }}>State 2: Desktop Authenticated View (Figma 4626:372065 &amp; 753:11852)</span>
              <span style={{ fontSize: "11px", color: "#7F776E" }}>40x40 orange plus action box • Online indicator • Popover menu</span>
            </div>
            <NavBar
              isSignedIn={true}
              onSignOut={() => setDemoNavSignedIn(false)}
            />
          </div>

          {/* State 3: Tablet Simulation */}
          <div style={{ width: "100%", border: "1px solid var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "8px 16px", background: "var(--color-surface-cream)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600 }}>State 3: Tablet View Simulation (768px - 992px)</span>
              <span style={{ fontSize: "11px", color: "#7F776E" }}>Hamburger toggle • Search bar visible • Quick drawer</span>
            </div>
            <div style={{ maxWidth: "768px", margin: "0 auto", borderLeft: "1px dashed #D0D5DD", borderRight: "1px dashed #D0D5DD" }}>
              <NavBar
                isSignedIn={demoNavSignedIn}
                responsiveMode="tablet"
                onOpenLoginModal={() => setDemoLoginModalOpen(true)}
                onGetStarted={() => setDemoLoginModalOpen(true)}
                onSignOut={() => setDemoNavSignedIn(false)}
              />
            </div>
          </div>

          {/* State 4: Mobile Closed Header State (375px) */}
          <div style={{ width: "100%", border: "1px solid var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "8px 16px", background: "var(--color-surface-cream)", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600 }}>State 4: Mobile Header View (375px)</span>
              <span style={{ fontSize: "11px", color: "#7F776E" }}>Compact header • Hamburger toggle (menu opens upon tap)</span>
            </div>
            <div style={{ maxWidth: "375px", margin: "0 auto", borderLeft: "1px dashed #D0D5DD", borderRight: "1px dashed #D0D5DD", background: "#FFEEDD" }}>
              <NavBar
                isSignedIn={demoNavSignedIn}
                responsiveMode="mobile"
                onOpenLoginModal={() => setDemoLoginModalOpen(true)}
                onGetStarted={() => setDemoLoginModalOpen(true)}
                onSignOut={() => setDemoNavSignedIn(false)}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Live Modal Demo */}
      <LoginModal
        isOpen={demoLoginModalOpen}
        onClose={() => setDemoLoginModalOpen(false)}
        onLogin={() => {
          setDemoNavSignedIn(true);
          setDemoLoginModalOpen(false);
        }}
      />

      {/* 14. Categories Mega Menu Dropdown & Variants (Node 750:3470, 750:4067) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            14. Categories Mega Menu Dropdown &amp; Overlay
            <span className={styles.nodeBadge}>Nodes 750:3470, 750:4067</span>
          </h2>
          <p className={styles.sectionDesc}>
            Interactive dropdown menu featuring 3 active tab variants (By use-case, By role, By output), exact Figma vector icons (#000000 import icon, #7F776E arrow chevron), #FFECD8 cream surface, #CFD9E8 borders, and full backdrop overlay (rich espresso-charcoal scrim rgba(18, 14, 12, 0.65) with 12px blur + saturation).
          </p>
        </div>

        <div className={styles.sandboxCard} style={{ flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <Button
              variant="brand"
              size="sm"
              onClick={() => setDemoDropdownOverlayOpen(true)}
            >
              Test with Fullscreen Blur Overlay (Node 750:4067)
            </Button>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>Active Tab Variant:</span>
              <Button
                variant={demoDropdownTab === "use-case" ? "primary" : "outline"}
                size="sm"
                onClick={() => setDemoDropdownTab("use-case")}
              >
                1. By use-case (215)
              </Button>
              <Button
                variant={demoDropdownTab === "role" ? "primary" : "outline"}
                size="sm"
                onClick={() => setDemoDropdownTab("role")}
              >
                2. By role (216)
              </Button>
              <Button
                variant={demoDropdownTab === "output" ? "primary" : "outline"}
                size="sm"
                onClick={() => setDemoDropdownTab("output")}
              >
                3. By output (217)
              </Button>
            </div>
          </div>

          {/* Interactive Standalone Component Container */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "16px 0" }}>
            <CategoriesDropdown
              activeTab={demoDropdownTab}
              onTabChange={(tab) => setDemoDropdownTab(tab)}
              onSelectCategory={(cat, tab) => alert(`Selected: ${cat} from ${tab}`)}
              onSeeAllSkills={() => alert("Navigating to all skills")}
            />
          </div>
        </div>

        {/* Modal Overlay Demonstration */}
        {demoDropdownOverlayOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(18, 14, 12, 0.65)",
              backdropFilter: "blur(12px) saturate(140%) brightness(0.92)",
              WebkitBackdropFilter: "blur(12px) saturate(140%) brightness(0.92)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "90px",
              overscrollBehavior: "contain",
              touchAction: "none",
            }}
            onWheel={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            onClick={() => setDemoDropdownOverlayOpen(false)}
          >
            <div 
              style={{ maxWidth: "620px", width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <button
                  type="button"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    padding: "6px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => setDemoDropdownOverlayOpen(false)}
                >
                  Close Overlay [Esc]
                </button>
              </div>
              <CategoriesDropdown
                onSelectCategory={(cat) => {
                  alert(`Selected: ${cat}`);
                  setDemoDropdownOverlayOpen(false);
                }}
                onSeeAllSkills={() => {
                  alert("See all Skills clicked");
                  setDemoDropdownOverlayOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </section>
      {/* 15. User Profile Dropdown Menu & Interactive States (Figma Node 760:12903) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            15. User Profile Dropdown Menu &amp; Interactive States
            <span className={styles.nodeBadge}>Figma Node 4626:379155 (drop down menu/attending)</span>
          </h2>
          <p className={styles.sectionDesc}>
            Authentic attending user dropdown menu matching Figma Node 760:12903: fixed <code>200px</code> width, <code>#FFECD8</code> surface cream background, <code>16px</code> padding, dual elevation shadow (<code>0px 4px 6px -2px rgba(0,0,0,0.06), 0px 12px 16px -4px rgba(0,0,0,0.1)</code>), 18px vector icons, 1px dividers, press micro-interaction (scale 0.96), and full keyboard navigation.
          </p>
        </div>

        <div className={styles.sandboxCard} style={{ gap: "24px" }}>
          <div className={styles.popoverShowcaseContainer}>
            {/* Live Interactive Dropdown Preview */}
            <div className={styles.popoverInteractiveArea}>
              <UserMenuPopover
                variant={demoUserMenuVariant}
                activeItem={demoUserMenuActiveItem}
                className={styles.popoverStaticWrapper}
                onMySkills={() => setDemoUserMenuFeedback("Navigating to My Skills...")}
                onBookmarks={() => setDemoUserMenuFeedback("Navigating to My Skills...")}
                onDirectoryHistory={() => setDemoUserMenuFeedback("Navigating to Directory history...")}
                onProfile={() => setDemoUserMenuFeedback("Opening User Profile...")}
                onAccountSettings={() => setDemoUserMenuFeedback("Opening Account settings...")}
                onHelpCenter={() => setDemoUserMenuFeedback("Opening Help center...")}
                onSwitchHost={() => setDemoUserMenuFeedback("Switched to Host mode")}
                onSwitchServiceProvider={() => setDemoUserMenuFeedback("Switched to Service Provider mode")}
                onMyListings={() => setDemoUserMenuFeedback("Opening My Listings & Services...")}
                onLogout={() => setDemoUserMenuFeedback("Signed out of session")}
                onClose={() => setDemoUserMenuFeedback("Menu closed via Escape / Click outside")}
              />
            </div>

            {/* Interactive Control Panel */}
            <div className={styles.popoverControlsCard}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-dark)" }}>
                  Dropdown Variant:
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Button
                    variant={demoUserMenuVariant === "attending" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setDemoUserMenuVariant("attending")}
                  >
                    Attending (Figma Node 760:12903)
                  </Button>
                  <Button
                    variant={demoUserMenuVariant === "extended" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setDemoUserMenuVariant("extended")}
                  >
                    Extended (Figma Node 753:11852)
                  </Button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-dark)" }}>
                  Simulate Active / Focused Route:
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { id: "none", label: "None (Idle)" },
                    { id: "bookmarks", label: "Bookmarks" },
                    { id: "profile", label: "Profile" },
                    { id: "settings", label: "Account settings" },
                    { id: "help", label: "Help center" },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant={demoUserMenuActiveItem === (item.id === "none" ? "" : item.id) ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setDemoUserMenuActiveItem(item.id === "none" ? "" : item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "12px 16px", background: "var(--color-surface-hover)", border: "1px solid var(--color-border)", borderRadius: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Interactive Feedback Status:
                </span>
                <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: demoUserMenuFeedback ? "var(--color-brand)" : "var(--color-text-muted)" }}>
                  {demoUserMenuFeedback || "Click any item in the preview or use Arrow keys to test."}
                </span>
              </div>

              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                <strong>Interactive Specs:</strong>
                <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                  <li><strong>Hover feedback:</strong> Translates <code>translateX(2px)</code> with <code>#FBE1C7</code> peach background.</li>
                  <li><strong>Press feedback:</strong> Exact <code>scale(0.96)</code> compression on active click.</li>
                  <li><strong>Keyboard operable:</strong> ArrowDown / ArrowUp traverses items, Home / End jumps, Escape triggers close.</li>
                  <li><strong>Elevation:</strong> Dual shadow <code>0px 4px 6px -2px rgba(0,0,0,0.06), 0px 12px 16px -4px rgba(0,0,0,0.1)</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. Connect Your Agent Integration Section (Figma Node 759:12087) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            16. Connect Your Agent Section
            <span className={styles.nodeBadge}>Node 759:12087</span>
          </h2>
          <p className={styles.sectionDesc}>
            High-converting onboarding banner with supported agent CLIs (Claude Code, Antigravity, Kimi Code CLI, Gemini CLI, Codex, Cursor), dark syntax-highlighted install prompt, and 3-step verification flow.
          </p>
        </div>

        <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}>
          <ConnectAgentBanner />
        </div>
      </section>
      {/* 17. Category Skill Grid & Cards (Figma Node 751:4789) */}
      <section className={styles.section} id="category-cards">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            17. Category Skill Grid & Cards
            <span className={styles.nodeBadge}>Node 751:4789</span>
          </h2>
          <p className={styles.sectionDesc}>
            Modular category skill navigation grid with responsive bridging connectors and interactive tactile cards.
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <CategorySkillCard
            title={"Featured \nAgent Skills"}
            href="/skills?category=featured"
          />
          <CategorySkillCard
            title={"Trending \nAgent Skills"}
            href="/skills?category=trending"
          />
        </div>

        <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}>
          <CategorySkillGrid />
        </div>
      </section>
      {/* 18. Global Footer Architecture & Specifications (Figma Node 751:7780 / 751:4917) */}
      <section className={styles.section} id="footer-component">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            18. Global Footer Architecture & Specifications
            <span className={styles.nodeBadge}>Node 751:7780 / 751:4917</span>
          </h2>
          <p className={styles.sectionDesc}>
            Empirical dark marketplace footer strictly aligned to the 1600px container width with 40px left/right margins matching the Header Nav. Features an absolute background watermark wordmark, authentic vector logo badge, social links (X and LinkedIn), and 5 structured navigation columns.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
          <div style={{ padding: "16px", background: "var(--color-surface-peach)", border: "1px solid var(--color-border-subtle)", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>Container & Margin Alignment</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Matches Header Nav container exactly (<code>max-width: 1600px; padding: 0 40px;</code>). Logo badge begins flush at 40px, rightmost column ends flush at 40px.
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--color-surface-cream)", border: "1px solid var(--color-border-subtle)", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>Absolute Watermark Text</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Positioned strictly <code>absolute; bottom: -40px; width: 100%; pointer-events: none;</code> behind content. Never offsets or expands container layout.
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--color-surface-peach)", border: "1px solid var(--color-border-subtle)", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>5 Structured Columns</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Geist Pixel Square headers (16px, <code>#FB6320</code>) with 23 verified links across Explore, Categories, By output, By agent, and Skillhouse.
            </p>
          </div>
        </div>

        <div style={{ padding: "14px 20px", background: "#000000", color: "#FFFFFF", borderRadius: "4px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
          <span>👇 <strong>Live Global Implementation:</strong> Scroll down to the bottom of the page to inspect the live, full-screen responsive footer.</span>
          <span style={{ color: "var(--color-brand)", fontFamily: "var(--font-pixel)", fontSize: "12px" }}>1600px ALIGNED</span>
        </div>
      </section>

      {/* 19. My Skills Workspace Architecture & States (Nodes 4687:201493, 4687:203867, 4687:205241 & Sinedogma 3D Tilt Mechanics) */}
      <section className={styles.section} id="section-19" data-testid="ds-section-my-skills-workspace">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionNumber}>19</span>
            <span className={styles.nodeBadge}>Figma Nodes 4687:201493, 4687:203867, 4687:205241</span>
          </div>
          <h2 className={styles.sectionTitle}>My Skills Workspace — Empty &amp; Filled States</h2>
          <p className={styles.sectionDesc}>
            Comprehensive agent workspace logic displayed when a user clicks &quot;My Skills&quot; from the navigation dropdown. Incorporates the exact <strong>sinedogma.com.tr</strong> 3D perspective hover tilt mechanics (<code>perspective(900px) rotateX(--tilt-x) rotateY(--tilt-y)</code>), responsive category filter chips, search filtering, and the interactive detail drawer.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", background: "var(--color-surface-peach)", border: "1px solid var(--color-border-subtle)" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>
              Empty State (Node 4687:201493)
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Displays when 0 skills are saved. Features the Lucide <code>ReceiptText</code> peach container, motivating copy, Explore Marketplace CTA, and 3 workflow cards.
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--color-surface-cream)", border: "1px solid var(--color-border-subtle)" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>
              Filled State (Node 4687:203867)
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Displays user&apos;s saved tools with real-time text filter, category chips, active agent sync badge, and 1-click bookmark removal.
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--color-surface-peach)", border: "1px solid var(--color-border-subtle)" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontFamily: "var(--font-pixel)", color: "var(--color-brand)" }}>
              Sinedogma Tilt &amp; Drawer (Node 4687:205241)
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Dynamic pointer tracking calculates <code>--tilt-x</code> and <code>--tilt-y</code> angles. Clicking any card slides open the full capability drawer.
            </p>
          </div>
        </div>

        <div style={{ padding: "20px", background: "#FFEEDD", border: "1px solid #CDB7AE" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontWeight: 600, fontSize: "14px" }}>
              Interactive Preview: Toggle between Empty and Filled States
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className={styles.tokenButton}
                onClick={() => setDemoWorkspaceSavedIds([])}
                style={{
                  background: demoWorkspaceSavedIds.length === 0 ? "var(--color-brand)" : "#FFEEDD",
                  color: demoWorkspaceSavedIds.length === 0 ? "#FFFFFF" : "#000000",
                  borderColor: demoWorkspaceSavedIds.length === 0 ? "var(--color-brand)" : "#CDB7AE"
                }}
              >
                Simulate Empty State (0 skills)
              </button>
              <button
                type="button"
                className={styles.tokenButton}
                onClick={() => setDemoWorkspaceSavedIds(["visual-canvas-deck", "pixel-promo-video", "algorithmic-music-composition"])}
                style={{
                  background: demoWorkspaceSavedIds.length > 0 ? "var(--color-brand)" : "#FFEEDD",
                  color: demoWorkspaceSavedIds.length > 0 ? "#FFFFFF" : "#000000",
                  borderColor: demoWorkspaceSavedIds.length > 0 ? "var(--color-brand)" : "#CDB7AE"
                }}
              >
                Simulate Filled State (3 skills)
              </button>
            </div>
          </div>

          <div style={{ border: "1px solid #CDB7AE", background: "#FFEEDD" }}>
            <MySkillsWorkspace
              savedSkillIds={demoWorkspaceSavedIds}
              installedSkillIds={["pixel-promo-video"]}
              onToggleBookmark={(id: string) => {
                setDemoWorkspaceSavedIds((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                );
              }}
              onToggleInstall={(id: string) => {
                setDemoUserMenuFeedback(`Toggled installation for ${id}`);
              }}
              onNavigateHome={() => setDemoUserMenuFeedback("Navigating to Home...")}
              onNavigateMarketplace={() => setDemoUserMenuFeedback("Navigating to Marketplace...")}
              onOpenCommandPalette={() => setDemoUserMenuFeedback("Opened Command Palette (⌘K)")}
              onRequestSkill={() => setDemoUserMenuFeedback("Opened Request a Skill Modal")}
              isSignedIn={true}
              user={{ name: "Alex Vance", email: "alex@skillhouse.ai" }}
            />
          </div>
        </div>
      </section>

    </div>
  );
};
