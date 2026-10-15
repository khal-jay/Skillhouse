"use client";

import React from "react";
import Image from "next/image";
import { Pill } from "../ui/Pill";
import styles from "./SkillRuntimeSpecs.module.css";

export interface SkillRuntimeSpecsProps {
  runsInModels?: string[];
  installGuides?: string[];
  generatesWith?: string[];
  className?: string;
}

export const SkillRuntimeSpecs: React.FC<SkillRuntimeSpecsProps> = ({
  runsInModels = [
    "/figma/logo-1.png",
    "/figma/logo-2.png",
    "/figma/logo-3.png",
    "/figma/logo-4.png",
    "/figma/logo-5.png",
    "/figma/logo-6.png",
  ],
  installGuides = ["Claude Code", "Cursor"],
  generatesWith = ["Host Agent LLM"],
  className = "",
}) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      aria-label="Skill runtime and environment compatibility specifications"
    >
      {/* 1. Runs In Row */}
      <div className={styles.specRow}>
        <span className={styles.label}>Runs in</span>
        <div className={styles.logomarksRow} aria-label="Supported execution environments">
          {runsInModels.map((logo, index) => (
            <div
              key={index}
              className={styles.logomark}
              title={`Runtime environment ${index + 1}`}
            >
              <Image
                src={logo}
                alt=""
                width={18}
                height={18}
                className={styles.logomarkIcon}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      {/* 2. Install Guides Row */}
      <div className={styles.specRow}>
        <span className={styles.label}>Install guides</span>
        <div className={styles.pillsRow} role="list" aria-label="Supported install guides">
          {installGuides.map((guide) => (
            <Pill key={guide} interactive={false} as="span" role="listitem">
              {guide}
            </Pill>
          ))}
        </div>
      </div>

      {/* 3. Generates With Row */}
      <div className={styles.specRow}>
        <span className={styles.label}>Generates with</span>
        <div className={styles.pillsRow} role="list" aria-label="Generation pipeline">
          {generatesWith.map((gen) => (
            <Pill key={gen} interactive={false} as="span" role="listitem">
              {gen}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
};
