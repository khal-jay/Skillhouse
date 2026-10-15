"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
  Terminal,
  BookOpen,
} from "lucide-react";
import styles from "./SkillDocViewer.module.css";

export interface SkillCapability {
  title: string;
  description: string;
}

export interface SkillExample {
  id?: string;
  title: string;
  imageUrl: string;
  description?: string;
  prompt?: string;
}

export interface SkillFeatureItem {
  title: string;
  description?: string;
}

export interface SkillUseCaseItem {
  title: string;
  description: string;
}

export interface SkillDocViewerProps {
  skillId?: string;
  skillTitle?: string;
  description?: string;
  skillMarkdown?: string;
  defaultSkillMdMode?: "raw" | "guide";
  examples?: SkillExample[];
  capabilities?: SkillCapability[];
  features?: SkillFeatureItem[];
  useCases?: SkillUseCaseItem[];
  supportedTargets?: string[];
  roles?: string[];
  className?: string;
  onSelectExample?: (example: SkillExample) => void;
}

const DEFAULT_OVERVIEW_TEXT =
  "Create an exploratory presentation that turns a rough brief into editable spatial compositions and a coherent deck. It supports visual iteration through addressable canvases, clear outline approval, and a browser-ready presentation. Every deck can be edited in the browser and exported as an editable PowerPoint file.";

const DEFAULT_CAPABILITIES: SkillCapability[] = [
  {
    title: "Spatial Composition",
    description: "Converts linear copy into responsive grid layouts, card clusters and hierarchical slides.",
  },
  {
    title: "Live Browser Editing",
    description: "Inspect, reorder, and tweak slide tokens directly in an interactive web-based canvas preview.",
  },
  {
    title: "PowerPoint (.pptx) Export",
    description: "One-click export produces fully native, unflattened PowerPoint files ready for team collaboration.",
  },
  {
    title: "Sandboxed Execution",
    description: "Runs in local sub-processes with zero unauthorized outbound network requests or file writes.",
  },
];

export const DEFAULT_FEATURES: SkillFeatureItem[] = [
  {
    title: "1 GitHub stars",
    description: "1 GitHub stars",
  },
  {
    title: "Multi-platform component kit generation for React, React Native, SwiftUI, and Shopify",
    description: "Multi-platform component kit generation for React, React Native, SwiftUI, and Shopify",
  },
  {
    title: "Design system discovery, brand customization, and CSS extraction",
    description: "Design system discovery, brand customization, and CSS extraction",
  },
  {
    title: "Automated icon search, selection, and asset installation",
    description: "Automated icon search, selection, and asset installation",
  },
  {
    title: "Contextual UI and UX principle checks for typography, spacing, forms, and error states",
    description: "Contextual UI and UX principle checks for typography, spacing, forms, and error states",
  },
  {
    title: "Structured design workflow integration with automated UI review checks",
    description: "Structured design workflow integration with automated UI review checks",
  },
];

export const DEFAULT_USE_CASES: SkillUseCaseItem[] = [
  {
    title: "Standardizing UI patterns and icon libraries across Next.js, Expo, and SwiftUI codebases",
    description: "Standardizing UI patterns and icon libraries across Next.js, Expo, and SwiftUI codebases",
  },
  {
    title: "Bootstrapping a new web or mobile app with a cohesive design system and component kit",
    description: "Bootstrapping a new web or mobile app with a cohesive design system and component kit",
  },
  {
    title: "Redesigning existing applications by extracting tokens from live URLs or brand stylesheets",
    description: "Redesigning existing applications by extracting tokens from live URLs or brand stylesheets",
  },
];

export const DEFAULT_SUPPORTED_TARGETS: string[] = [
  "React / Next.js",
  "Plain HTML / Canvas",
  "React Native / Expo",
  "SwiftUI (iOS)",
  "Shopify Liquid",
  "Claude Code",
  "Codex & Cursor",
];

export const generateContextualMarkdown = (
  skillId: string,
  skillTitle: string,
  description?: string
) => {
  const cleanDescription =
    description || "Build or redesign interfaces and deliverables using standardized systems and component kits.";
  return `---
name: ${skillId}
description: ${cleanDescription}
---

# ${skillTitle}

The ${skillTitle} agent provides automated generation, production engineering, and verification checks. This skill is the order to use them in when building deliverables.

## 1. Detect & Preserve Existing Design System

If \`components/ui/\` already holds a Better Design system, or \`components/icons/.library.json\` names an icon library, build with those. Change them only when the user asks.

## 2. Choose a design system with the user

1. Call \`find-design-system\` with a short description of the product and its audience.
2. Show the user the top matches, each with its name and preview link, and let the user pick one.
3. For a custom brand, call \`create-design-system\` with a description of the look. Pass the chosen match as \`baseDesignSystemId\`, or pass \`brandCss\` from \`extract-from-url\` or \`extract-design-system\` when the user has an existing site or stylesheet.
4. Poll \`get-design-system-status\` until the system is ready, then share its preview link.

## 3. Install Component Kit for Target Framework

Call \`get-design-system-kit\` with the target that fits the project:

| Project | Target |
| --- | --- |
| React or Next.js with a terminal | \`react\`, then run the returned install command |
| Plain HTML / Canvas | \`html\` |
| React Native or Expo | \`react-native\` |
| SwiftUI (iOS) | \`swiftui\` |
| A Shopify theme | \`shopify\` |

Build with the installed components instead of writing new ones.

## 4. Check the principles for the job

- Before styling, call \`get-ui-principle\` with the topic, such as \`spacing\`, \`typography\` or \`color\`.
- Before building a flow, call \`get-ux-principle\` with the topic, such as \`forms\`, \`onboarding\` or \`errors\`.
- For icons, call \`find-icon-library\`, then \`find-icons\`, then \`install-icons\`, and save the returned files.

## 5. Review before you present

Use the \`review-ui-with-better-design\` skill on the finished screens, and fix every critical and serious finding.
`;
};

export const DEFAULT_SKILL_MARKDOWN = `---
name: build-with-better-design
description: Build or redesign a web or mobile interface on a Better Design design system. Use when the user asks for an app, site, page, dashboard or component and wants it built on Better Design, or asks to choose, create or install a design system.
---

# Build with Better Design

The Better Design MCP server provides design systems, design principles and review checks. This skill is the order to use them in when building an interface.

## 1. Keep the design system the project already has

If \`components/ui/\` already holds a Better Design system, or \`components/icons/.library.json\` names an icon library, build with those. Change them only when the user asks.

## 2. Choose a design system with the user

1. Call \`find-design-system\` with a short description of the product and its audience.
2. Show the user the top matches, each with its name and preview link, and let the user pick one.
3. For a custom brand, call \`create-design-system\` with a description of the look. Pass the chosen match as \`baseDesignSystemId\`, or pass \`brandCss\` from \`extract-from-url\` or \`extract-design-system\` when the user has an existing site or stylesheet.
4. Poll \`get-design-system-status\` until the system is ready, then share its preview link.

## 3. Install it

Call \`get-design-system-kit\` with the target that fits the project:

| Project | Target |
| --- | --- |
| React or Next.js with a terminal | \`react\`, then run the returned install command |
| An inline canvas or artifact with no build step | \`html\` |
| React Native or Expo | \`react-native\` |
| An iOS app in SwiftUI | \`swiftui\` |
| A Shopify theme | \`shopify\` |

Build with the installed components instead of writing new ones.

## 4. Check the principles for the job

- Before styling, call \`get-ui-principle\` with the topic, such as \`spacing\`, \`typography\` or \`color\`.
- Before building a flow, call \`get-ux-principle\` with the topic, such as \`forms\`, \`onboarding\` or \`errors\`.
- For icons, call \`find-icon-library\`, then \`find-icons\`, then \`install-icons\`, and save the returned files.

## 5. Review before you present

Use the \`review-ui-with-better-design\` skill on the finished screens, and fix every critical and serious finding.
`;

export interface SkillDocBlock {
  type: "h1" | "h2" | "h3" | "p" | "ol" | "ul" | "table";
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface ParsedSkillDoc {
  name: string;
  description: string;
  blocks: SkillDocBlock[];
}

export function parseSkillDoc(
  markdown: string,
  fallbackName: string,
  fallbackDesc: string
): ParsedSkillDoc {
  let name = fallbackName;
  let description = fallbackDesc;
  let body = markdown;

  if (markdown.startsWith("---")) {
    const endFront = markdown.indexOf("\n---", 3);
    if (endFront !== -1) {
      const front = markdown.slice(3, endFront);
      body = markdown.slice(endFront + 4).trim();
      const nameMatch = front.match(/^name:\s*(.+)$/m);
      const descMatch = front.match(/^description:\s*([\s\S]+?)(?=(\n[a-z_]+:|$))/m);
      if (nameMatch) name = nameMatch[1].trim();
      if (descMatch) description = descMatch[1].trim().replace(/\n\s+/g, " ");
    }
  }

  const lines = body.split("\n");
  const blocks: SkillDocBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const rows = tableLines
          .slice(2)
          .map((r) =>
            r
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );
        blocks.push({ type: "table", headers, rows });
      }
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }

  return { name, description, blocks };
}

const renderInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={index} className={styles.inlineCodeBadge}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const renderDocBlocks = (blocks: SkillDocBlock[]) => {
  let hasEncounteredH1 = false;
  return blocks.map((block, idx) => {
    switch (block.type) {
      case "h1":
        hasEncounteredH1 = true;
        return (
          <h1 key={idx} className={styles.docTitle}>
            {renderInlineMarkdown(block.text || "")}
          </h1>
        );
      case "h2":
        return (
          <h2 key={idx} className={styles.docSectionHeading}>
            {renderInlineMarkdown(block.text || "")}
          </h2>
        );
      case "h3":
        return (
          <h3 key={idx} className={styles.docSubHeading}>
            {renderInlineMarkdown(block.text || "")}
          </h3>
        );
      case "p": {
        const isLead = hasEncounteredH1 && idx === 1;
        return (
          <p
            key={idx}
            className={isLead ? styles.docLead : styles.docParagraph}
          >
            {renderInlineMarkdown(block.text || "")}
          </p>
        );
      }
      case "ol":
        return (
          <ol key={idx} className={styles.docOrderedList}>
            {block.items?.map((item, itemIdx) => (
              <li key={itemIdx} className={styles.docListItem}>
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      case "ul":
        return (
          <ul key={idx} className={styles.docBulletList}>
            {block.items?.map((item, itemIdx) => (
              <li key={itemIdx} className={styles.docListItem}>
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div key={idx} className={styles.docTableWrapper}>
            <table className={styles.docTable}>
              {block.headers && block.headers.length > 0 && (
                <thead>
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx}>{renderInlineMarkdown(h)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              {block.rows && block.rows.length > 0 && (
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{renderInlineMarkdown(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        );
      default:
        return null;
    }
  });
};

/**
 * CornerBrackets: Renders authentic Figma #FB6320 corner brackets on all 4 corners of a card or modal
 */
const CornerBrackets: React.FC = () => (
  <>
    <svg
      className={`${styles.cornerBracket} ${styles.cornerTl}`}
      width="7"
      height="6"
      viewBox="0 0 7 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.5 0.5H0.5V5.5" stroke="#FB6320" strokeWidth="1" />
    </svg>
    <svg
      className={`${styles.cornerBracket} ${styles.cornerTr}`}
      width="7"
      height="6"
      viewBox="0 0 7 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0.5 0.5H6.5V5.5" stroke="#FB6320" strokeWidth="1" />
    </svg>
    <svg
      className={`${styles.cornerBracket} ${styles.cornerBl}`}
      width="7"
      height="6"
      viewBox="0 0 7 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.5 5.5H0.5V0.5" stroke="#FB6320" strokeWidth="1" />
    </svg>
    <svg
      className={`${styles.cornerBracket} ${styles.cornerBr}`}
      width="7"
      height="6"
      viewBox="0 0 7 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0.5 5.5H6.5V0.5" stroke="#FB6320" strokeWidth="1" />
    </svg>
  </>
);

export const SkillDocViewer: React.FC<SkillDocViewerProps> = ({
  skillId = "visual-canvas-deck",
  skillTitle = "Visual Canvas Deck",
  description = DEFAULT_OVERVIEW_TEXT,
  skillMarkdown,
  defaultSkillMdMode,
  examples,
  capabilities = DEFAULT_CAPABILITIES,
  features = DEFAULT_FEATURES,
  useCases = DEFAULT_USE_CASES,
  supportedTargets = DEFAULT_SUPPORTED_TARGETS,
  className = "",
  onSelectExample,
}) => {
  const effectiveMarkdown = skillMarkdown || (
    skillId === "visual-canvas-deck" || skillId === "build-with-better-design"
      ? DEFAULT_SKILL_MARKDOWN
      : generateContextualMarkdown(skillId, skillTitle, description)
  );

  const parsedDoc = parseSkillDoc(effectiveMarkdown, skillId, description);
  const [activeTab, setActiveTab] = useState<"overview" | "skill-md" | "reviews">("overview");
  const [skillMdMode, setSkillMdMode] = useState<"raw" | "guide">(defaultSkillMdMode || "raw");
  const [copied, setCopied] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showAllExamples, setShowAllExamples] = useState(false);

  // References for accessibility and filmstrip management
  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const filmstripTrackRef = useRef<HTMLDivElement | null>(null);

  // Dynamic contextual examples fallback
  const activeExamples: SkillExample[] = examples && examples.length > 0
    ? examples
    : [
        {
          id: "ex-1",
          title: "Pixel Promo Video",
          imageUrl: "/figma/visual_canvas_deck_slide1.png",
          description: "16:9 modular canvas mapping unstructured briefs into phase-based presentation architecture.",
          prompt: "npx @skillhouse/cli run " + skillId + " --phase 01 --template spatial",
        },
        {
          id: "ex-2",
          title: "Pixel Promo Video",
          imageUrl: "/figma/visual_canvas_deck_slide2.png",
          description: "Production-tested visual design systems for executive briefs and technical keynotes.",
          prompt: "npx @skillhouse/cli run " + skillId + " --phase 02 --schema bento",
        },
        {
          id: "ex-3",
          title: "Pixel Promo Video",
          imageUrl: "/figma/visual_canvas_deck_slide3.png",
          description: "Clean, zero-dependency browser interactive presentations and editable PowerPoint (.pptx) export.",
          prompt: "npx @skillhouse/cli run " + skillId + " --phase 03 --export pptx",
        },
      ];

  const handleOpenExample = (index: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    triggerButtonRef.current = (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
    setSelectedExampleIndex(index);
    setCopiedPrompt(false);
    if (activeExamples[index] && onSelectExample) {
      onSelectExample(activeExamples[index]);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedExampleIndex(null);
    setCopiedPrompt(false);
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 0);
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(effectiveMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleCopyPrompt = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (selectedExampleIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedExampleIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : activeExamples.length - 1) : 0
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedExampleIndex((prev) =>
          prev !== null ? (prev < activeExamples.length - 1 ? prev + 1 : 0) : 0
        );
      } else if (e.key === "Home") {
        e.preventDefault();
        setSelectedExampleIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSelectedExampleIndex(activeExamples.length - 1);
      } else if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), pre[tabindex="0"], [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedExampleIndex, activeExamples.length]);

  // Lock body scroll when lightbox modal is open
  useEffect(() => {
    if (selectedExampleIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedExampleIndex]);

  // Scroll active filmstrip thumbnail into view inside modal
  useEffect(() => {
    if (selectedExampleIndex === null || !filmstripTrackRef.current) return;
    const activeThumb = filmstripTrackRef.current.children[selectedExampleIndex] as HTMLElement;
    if (activeThumb && typeof activeThumb.scrollIntoView === "function") {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedExampleIndex]);

  // Accessible tab keyboard navigation (Left/Right arrow cycling)
  const TABS: Array<"overview" | "skill-md" | "reviews"> = ["overview", "skill-md", "reviews"];

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = TABS.indexOf(activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextTab = TABS[(currentIndex + 1) % TABS.length];
      setActiveTab(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevTab = TABS[(currentIndex - 1 + TABS.length) % TABS.length];
      setActiveTab(prevTab);
      document.getElementById(`tab-${prevTab}`)?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(TABS[0]);
      document.getElementById(`tab-${TABS[0]}`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(TABS[TABS.length - 1]);
      document.getElementById(`tab-${TABS[TABS.length - 1]}`)?.focus();
    }
  };


  const renderPromptHighlighted = (markdown: string) => {
    const lines = markdown.split("\n");
    return lines.map((line, idx) => {
      const lineNo = idx + 1;
      if (line.startsWith("# ")) {
        return (
          <div key={idx} className={`${styles.promptLineRow} ${styles.promptH1Row}`}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span className={styles.promptH1Text}>{line}</span>
          </div>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <div key={idx} className={`${styles.promptLineRow} ${styles.promptH2Row}`}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span className={styles.promptH2Text}>{line}</span>
          </div>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <div key={idx} className={styles.promptLineRow}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span className={styles.promptH2Text}>{line}</span>
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={idx} className={styles.promptLineRow}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span className={styles.promptBulletMark}>•</span>
            <span className={styles.promptBulletText}>{line.slice(2)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+\.)\s(.*)$/);
        return (
          <div key={idx} className={styles.promptLineRow}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span className={styles.promptNumMark}>{match ? match[1] : ""}</span>
            <span className={styles.promptLineText}>{match ? match[2] : line}</span>
          </div>
        );
      }
      if (line.trim() === "") {
        return (
          <div key={idx} className={styles.promptLineRow}>
            <span className={styles.promptLineGutter}>{lineNo}</span>
            <span>&nbsp;</span>
          </div>
        );
      }
      return (
        <div key={idx} className={styles.promptLineRow}>
          <span className={styles.promptLineGutter}>{lineNo}</span>
          <span className={styles.promptLineText}>{line}</span>
        </div>
      );
    });
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      id={`skill-docs-${skillId}`}
      aria-label="Skill documentation and details"
      data-testid="skill-doc-viewer"
    >
      {/* 1. Horizontal Tabs Header Bar */}
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Documentation tabs"
        onKeyDown={handleTabKeyDown}
      >
        <button
          type="button"
          role="tab"
          id="tab-overview"
          aria-selected={activeTab === "overview"}
          aria-controls="panel-overview"
          className={`${styles.tabButton} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
          tabIndex={activeTab === "overview" ? 0 : -1}
          data-testid="tab-overview-btn"
        >
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
          tabIndex={activeTab === "skill-md" ? 0 : -1}
          data-testid="tab-skill-md-btn"
        >
          <span>Skill.md</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-reviews"
          aria-selected={activeTab === "reviews"}
          aria-controls="panel-reviews"
          className={`${styles.tabButton} ${activeTab === "reviews" ? styles.active : ""}`}
          onClick={() => setActiveTab("reviews")}
          tabIndex={activeTab === "reviews" ? 0 : -1}
          data-testid="tab-reviews-btn"
        >
          <span>Updates</span>
        </button>
      </div>

      {/* 2. Overview Tab Panel */}
      {activeTab === "overview" && (
        <div
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className={styles.tabPanel}
          data-testid="panel-overview"
        >
          {/* Executive Overview Narrative */}
          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionHeading}>Overview</h3>
            <p className={styles.overviewText}>
              {description || DEFAULT_OVERVIEW_TEXT}
            </p>
          </div>

          {/* Supported Targets & Frameworks */}
          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionHeading}>Supported Targets & Frameworks</h3>
            <div className={styles.targetsRow}>
              {supportedTargets.map((target, idx) => (
                <div key={idx} className={styles.targetPill}>
                  <Sparkles size={11} color="#FB6320" aria-hidden="true" />
                  <span>{target}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Key Features (MCP Market 2-Column Numbered Layout Matching Screenshot) */}
          <div className={styles.mcpSectionGroup} data-testid="key-features-section">
            <h3 className={styles.mcpSectionHeading}>Key Features</h3>
            <div className={styles.mcpGrid}>
              {features.map((feat, idx) => (
                <div key={idx} className={styles.mcpItem}>
                  <span className={styles.mcpIndex}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className={styles.mcpText}>
                    {feat.description || feat.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Use Cases (MCP Market 2-Column Numbered Layout Matching Screenshot) */}
          <div className={styles.mcpSectionGroup} data-testid="use-cases-section">
            <h3 className={styles.mcpSectionHeading}>Use Cases</h3>
            <div className={styles.mcpGrid}>
              {useCases.map((uc, idx) => (
                <div key={idx} className={styles.mcpItem}>
                  <span className={styles.mcpIndex}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className={styles.mcpText}>
                    {uc.description || uc.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Skill Examples */}
          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionHeading}>Skill Examples</h3>
            <div className={styles.examplesGrid} data-testid="skill-examples-grid">
              {(showAllExamples || activeExamples.length <= 6
                ? activeExamples
                : activeExamples.slice(0, 6)
              ).map((example, idx) => (
                <button
                  key={example.id || idx}
                  type="button"
                  className={styles.exampleCard}
                  onClick={(e) => handleOpenExample(idx, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenExample(idx, e);
                    }
                  }}
                  aria-label={"View example: " + example.title}
                  data-testid={"skill-example-card-" + idx}
                >
                  <div className={styles.exampleImageWrapper}>
                    <Image
                      src={example.imageUrl}
                      alt={example.title}
                      fill
                      sizes="166px"
                      className={styles.exampleImage}
                      unoptimized
                    />
                    <div className={styles.exampleHoverBadge} aria-hidden="true">
                      <Maximize2 size={11} />
                      <span>Preview</span>
                    </div>
                  </div>
                  <div className={styles.exampleCaptionRow}>
                    <span className={styles.exampleCaption}>{example.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {activeExamples.length > 6 && (
              <div className={styles.viewAllExamplesWrapper}>
                <button
                  type="button"
                  className={styles.viewAllExamplesBtn}
                  onClick={() => setShowAllExamples(!showAllExamples)}
                  data-testid="toggle-all-examples-btn"
                >
                  <span>{showAllExamples ? "Show Less" : "View All " + activeExamples.length + " Examples"}</span>
                </button>
              </div>
            )}
          </div>

          <hr className={styles.divider} />

          {/* Core Capabilities */}
          <div className={styles.sectionGroup}>
            <h3 className={styles.sectionHeading}>Core Capabilities</h3>
            <div className={styles.capabilitiesGrid}>
              {capabilities.map((capability, idx) => (
                <div key={idx} className={styles.capabilityCard}>
                  <CornerBrackets />
                  <h4 className={styles.capabilityTitle}>{capability.title}</h4>
                  <p className={styles.capabilityDesc}>{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SKILL.md Tab Panel (Documentation Guide & Polished Prompt View) */}
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
              <span className={styles.filePill}>
                <Terminal size={12} aria-hidden="true" />
                <span>SKILL.md</span>
              </span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaSubtitle}>Agent Execution Specification</span>
            </div>

            <div className={styles.segmentedControl} role="radiogroup" aria-label="Skill documentation view format">
              <button
                type="button"
                role="radio"
                aria-checked={skillMdMode === "guide"}
                className={`${styles.segmentedBtn} ${skillMdMode === "guide" ? styles.segmentedBtnActive : ""}`}
                onClick={() => setSkillMdMode("guide")}
                data-testid="skill-md-mode-guide"
              >
                <BookOpen size={12} aria-hidden="true" />
                <span>Documentation Guide</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={skillMdMode === "raw"}
                className={`${styles.segmentedBtn} ${skillMdMode === "raw" ? styles.segmentedBtnActive : ""}`}
                onClick={() => setSkillMdMode("raw")}
                data-testid="skill-md-mode-raw"
              >
                <Terminal size={12} aria-hidden="true" />
                <span>Prompt</span>
              </button>
            </div>

            <button
              type="button"
              className={styles.copyButton}
              onClick={handleCopyMarkdown}
              aria-label={copied ? "Prompt copied!" : "Copy prompt"}
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
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {skillMdMode === "guide" ? (
            <div className={styles.guideContainer} data-testid="skill-md-guide-view">
              {/* Frontmatter Metadata Table */}
              <div className={styles.frontmatterTable}>
                <div className={styles.frontmatterRow}>
                  <span className={styles.frontmatterLabel}>name</span>
                  <span className={styles.frontmatterValue}>{parsedDoc.name}</span>
                </div>
                <div className={styles.frontmatterDivider} />
                <div className={styles.frontmatterRow}>
                  <span className={styles.frontmatterLabel}>description</span>
                  <span className={styles.frontmatterValueDesc}>
                    {parsedDoc.description}
                  </span>
                </div>
              </div>

              {/* Formatted Markdown Content */}
              {renderDocBlocks(parsedDoc.blocks)}
            </div>
          ) : (
            <div className={styles.promptEditorWrapper} data-testid="skill-md-prompt-view">
              <div className={styles.promptEditorHeaderBar}>
                <div className={styles.promptWindowDots}>
                  <span className={`${styles.promptDot} ${styles.promptDotRed}`} />
                  <span className={`${styles.promptDot} ${styles.promptDotYellow}`} />
                  <span className={`${styles.promptDot} ${styles.promptDotGreen}`} />
                </div>

                <div className={styles.promptFileTab}>
                  <span className={styles.promptDotAccent} />
                  <span>SKILL.md</span>
                </div>

                <span className={styles.promptLineCount}>
                  {effectiveMarkdown.split("\n").length} lines • Markdown Prompt
                </span>
              </div>

              <div className={styles.promptContentScroll}>
                

                {renderPromptHighlighted(effectiveMarkdown)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Updates / Reviews Tab Panel */}
      {activeTab === "reviews" && (
        <div
          id="panel-reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          className={styles.tabPanel}
          data-testid="panel-reviews"
        >
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

      {/* 5. Accessible Lightbox Modal */}
      {selectedExampleIndex !== null && activeExamples[selectedExampleIndex] && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseLightbox}
          data-testid="skill-example-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={"Skill Example: " + activeExamples[selectedExampleIndex].title}
        >
          <div
            ref={modalRef}
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <CornerBrackets />

            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitleGroup}>
                <h3 className={styles.modalTitle}>
                  {activeExamples[selectedExampleIndex].title}
                </h3>
                <span className={styles.modalCounter} data-testid="lightbox-counter">
                  {String(selectedExampleIndex + 1).padStart(2, "0")} / {String(activeExamples.length).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalNavBtn}
                  onClick={() =>
                    setSelectedExampleIndex((prev) =>
                      prev !== null ? (prev > 0 ? prev - 1 : activeExamples.length - 1) : 0
                    )
                  }
                  aria-label="Previous example"
                  data-testid="lightbox-prev-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className={styles.modalNavBtn}
                  onClick={() =>
                    setSelectedExampleIndex((prev) =>
                      prev !== null ? (prev < activeExamples.length - 1 ? prev + 1 : 0) : 0
                    )
                  }
                  aria-label="Next example"
                  data-testid="lightbox-next-btn"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={handleCloseLightbox}
                  aria-label="Close example modal"
                  data-testid="lightbox-close-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className={styles.modalMediaArea}>
              <div className={styles.modalImageContainer}>
                <Image
                  src={activeExamples[selectedExampleIndex].imageUrl}
                  alt={activeExamples[selectedExampleIndex].title}
                  fill
                  className={styles.modalImage}
                  priority
                  unoptimized
                />
              </div>
            </div>

            {activeExamples.length >= 4 && (
              <div
                ref={filmstripTrackRef}
                className={styles.modalFilmstrip}
                role="tablist"
                aria-label="Example filmstrip navigation"
                data-testid="lightbox-filmstrip"
              >
                {activeExamples.map((ex, fIdx) => (
                  <button
                    key={ex.id || fIdx}
                    type="button"
                    role="tab"
                    aria-selected={selectedExampleIndex === fIdx}
                    className={`${styles.filmstripThumb} ${selectedExampleIndex === fIdx ? styles.filmstripThumbActive : ""}`}
                    onClick={() => setSelectedExampleIndex(fIdx)}
                    aria-label={"Jump to example " + (fIdx + 1) + ": " + ex.title}
                    data-testid={"filmstrip-thumb-" + fIdx}
                  >
                    <Image
                      src={ex.imageUrl}
                      alt={ex.title}
                      width={64}
                      height={40}
                      className={styles.filmstripImage}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            <div className={styles.modalFooter}>
              {activeExamples[selectedExampleIndex].description && (
                <p className={styles.modalDescription}>
                  {activeExamples[selectedExampleIndex].description}
                </p>
              )}

              {activeExamples[selectedExampleIndex].prompt && (
                <div className={styles.modalPromptBlock}>
                  <div className={styles.modalPromptHeader}>
                    <span className={styles.modalPromptLabel}>Executable Terminal Prompt</span>
                    <button
                      type="button"
                      className={styles.modalPromptCopyBtn}
                      onClick={() =>
                        handleCopyPrompt(activeExamples[selectedExampleIndex].prompt || "")
                      }
                      aria-label={copiedPrompt ? "Copied!" : "Copy prompt command"}
                      data-testid="lightbox-copy-prompt-btn"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check size={12} aria-hidden="true" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} aria-hidden="true" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre
                    className={styles.modalPromptCode}
                    tabIndex={0}
                    data-testid="lightbox-prompt-code"
                    aria-label="Executable terminal prompt"
                  >
                    <code>{activeExamples[selectedExampleIndex].prompt}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const SkillDetailsTabSection = SkillDocViewer;
