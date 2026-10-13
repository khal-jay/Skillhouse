"use client";

import React, { useState } from "react";
import {
  FileText,
  Layers,
  Star,
  Copy,
  Check,
  Sparkles,
  Presentation,
  Sliders,
  Download,
  ShieldAlert,
} from "lucide-react";
import styles from "./SkillDocViewer.module.css";

export interface SkillDocViewerProps {
  skillId?: string;
  skillTitle?: string;
  description?: string;
  skillMarkdown?: string;
  roles?: string[];
  className?: string;
}

const DEFAULT_SKILL_MARKDOWN = `# visual-canvas-deck

Turn rough briefs into addressable spatial canvases and exportable presentations.

## Runtimes
- Claude Code
- Cursor
- OpenAI Codex / GPT-4

## Usage
npx @skillhouse/cli install visual-canvas-deck

## Prompt Instructions
You are an expert presentation designer and spatial communication architect.
When given an executive brief, problem statement, or product outline:
1. Parse the core message into an addressable 3-tier outline: Context -> Mechanism -> Outcome.
2. Structure the slides with strict typographic hierarchy: headline <= 6 words, supporting narrative, visual anchor.
3. Generate native editable canvas coordinates or ready-to-run browser preview markup.
4. Export to standard 16:9 presentation dimensions with editable vector primitives.

## Output Constraints
- Zero arbitrary filesystem writes outside current working directory.
- Strictly offline-first rendering with no telemetry.
- Valid PowerPoint (.pptx) XML schemas compatible with standard Office suites.
`;

export const SkillDocViewer: React.FC<SkillDocViewerProps> = ({
  skillId = "visual-canvas-deck",
  skillTitle = "Visual Canvas Deck",
  description = "Create an exploratory presentation that turns a rough brief into editable spatial compositions and a coherent deck. It supports visual iteration through addressable canvases, clear outline approval, and a browser-ready presentation.",
  skillMarkdown = DEFAULT_SKILL_MARKDOWN,
  roles = ["Product Manager", "Graphic Designer", "Art Director", "Founder"],
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "skill-md" | "reviews">("overview");
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(skillMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      id={`skill-docs-${skillId}`}
      aria-label="Skill documentation and details"
      data-testid="skill-doc-viewer"
    >
      {/* Tab Navigation List */}
      <div className={styles.tabList} role="tablist" aria-label="Documentation tabs">
        <button
          type="button"
          role="tab"
          id="tab-overview"
          aria-selected={activeTab === "overview"}
          aria-controls="panel-overview"
          className={`${styles.tabButton} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
          data-testid="tab-overview-btn"
        >
          <Layers size={14} aria-hidden="true" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-skill-md"
          aria-selected={activeTab === "skill-md"}
          aria-controls="panel-skill-md"
          className={`${styles.tabButton} ${activeTab === "skill-md" ? styles.active : ""}`}
          onClick={() => setActiveTab("skill-md")}
          data-testid="tab-skill-md-btn"
        >
          <FileText size={14} aria-hidden="true" />
          <span>SKILL.md</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-reviews"
          aria-selected={activeTab === "reviews"}
          aria-controls="panel-reviews"
          className={`${styles.tabButton} ${activeTab === "reviews" ? styles.active : ""}`}
          onClick={() => setActiveTab("reviews")}
          data-testid="tab-reviews-btn"
        >
          <Star size={14} aria-hidden="true" />
          <span>Reviews & Changelog</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className={styles.tabPanel}
          data-testid="panel-overview"
        >
          <div className={styles.overviewGrid}>
            <div>
              <h3 className={styles.sectionHeading}>
                <Sparkles size={16} aria-hidden="true" />
                <span>Problem Solved: {skillTitle}</span>
              </h3>
              <p className={styles.overviewText}>
                {description}
              </p>
            </div>

            <div>
              <h3 className={styles.sectionHeading}>
                <Presentation size={16} aria-hidden="true" />
                <span>Core Capabilities</span>
              </h3>
              <div className={styles.capabilitiesGrid}>
                <div className={styles.capabilityCard}>
                  <h4 className={styles.capabilityTitle}>
                    <Sliders size={14} aria-hidden="true" />
                    <span>Spatial Composition</span>
                  </h4>
                  <p className={styles.capabilityDesc}>
                    Converts linear copy into responsive grid layouts, card clusters, and hierarchical slides.
                  </p>
                </div>

                <div className={styles.capabilityCard}>
                  <h4 className={styles.capabilityTitle}>
                    <Presentation size={14} aria-hidden="true" />
                    <span>Live Browser Editing</span>
                  </h4>
                  <p className={styles.capabilityDesc}>
                    Inspect, reorder, and tweak slide tokens directly in an interactive web-based canvas preview.
                  </p>
                </div>

                <div className={styles.capabilityCard}>
                  <h4 className={styles.capabilityTitle}>
                    <Download size={14} aria-hidden="true" />
                    <span>PowerPoint (.pptx) Export</span>
                  </h4>
                  <p className={styles.capabilityDesc}>
                    One-click export produces fully native, unflattened PowerPoint files ready for team collaboration.
                  </p>
                </div>

                <div className={styles.capabilityCard}>
                  <h4 className={styles.capabilityTitle}>
                    <ShieldAlert size={14} aria-hidden="true" />
                    <span>Sandboxed Execution</span>
                  </h4>
                  <p className={styles.capabilityDesc}>
                    Runs in local sub-processes with zero unauthorized outbound network requests or file writes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={styles.sectionHeading}>
                <span>Intended Audience</span>
              </h3>
              <div className={styles.badgeRow}>
                {roles.map((role) => (
                  <span key={role} className={styles.roleBadge}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "skill-md" && (
        <div
          id="panel-skill-md"
          role="tabpanel"
          aria-labelledby="tab-skill-md"
          className={styles.tabPanel}
          data-testid="panel-skill-md"
        >
          <div className={styles.codeHeader}>
            <div className={styles.codeMeta}>
              <span>File: <code>SKILL.md</code></span>
              <span>•</span>
              <span>Distribution format: Standard Markdown Prompt</span>
            </div>
            <button
              type="button"
              className={styles.copyButton}
              onClick={handleCopyMarkdown}
              aria-label={copied ? "SKILL.md copied!" : "Copy raw SKILL.md prompt"}
              data-testid="copy-skill-md-btn"
            >
              {copied ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  <span>Copy SKILL.md</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.codeBlockWrapper}>
            <pre className={styles.codeBlock}>
              <code>{skillMarkdown}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div
          id="panel-reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          className={styles.tabPanel}
          data-testid="panel-reviews"
        >
          <div className={styles.ratingHeader}>
            <div className={styles.ratingBig}>4.9</div>
            <div>
              <div className={styles.starsRow} aria-label="4.9 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" aria-hidden="true" />
                ))}
              </div>
              <span className={styles.reviewCount}>Based on 312 verified developer ratings</span>
            </div>
          </div>

          <div className={styles.reviewsList}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewAuthorRow}>
                <span className={styles.reviewAuthor}>
                  Alex Vance <span className={styles.reviewRole}>Staff Product Manager</span>
                </span>
                <span className={styles.changelogDate}>2 days ago</span>
              </div>
              <p className={styles.reviewText}>
                Turned our messy 4-page product spec into a clean 10-slide keynote structure in under 30 seconds.
                The PPTX export is completely native without flattened images.
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewAuthorRow}>
                <span className={styles.reviewAuthor}>
                  Marcus Lee <span className={styles.reviewRole}>Design Technologist</span>
                </span>
                <span className={styles.changelogDate}>1 week ago</span>
              </div>
              <p className={styles.reviewText}>
                The spatial layout engine follows real design principles instead of templated slide garbage.
                A must-have skill in Cursor and Claude Code.
              </p>
            </div>
          </div>

          <div className={styles.changelogSection}>
            <h3 className={styles.sectionHeading}>Version History</h3>
            <div className={styles.changelogItem}>
              <div className={styles.changelogVersion}>
                <span>v1.0.1</span>
                <span className={styles.changelogDate}>Oct 12, 2026</span>
              </div>
              <p className={styles.changelogNotes}>
                Added direct PowerPoint (.pptx) XML compilation engine. Improved responsive mobile canvas viewport.
              </p>
            </div>

            <div className={styles.changelogItem}>
              <div className={styles.changelogVersion}>
                <span>v1.0.0</span>
                <span className={styles.changelogDate}>Oct 3, 2026</span>
              </div>
              <p className={styles.changelogNotes}>
                Initial verified release with multi-slide canvas synthesis and runtime support for Claude and Cursor.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
