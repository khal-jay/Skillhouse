"use client";

import React from "react";
import { Pill } from "../ui/Pill";
import styles from "./SkillAudienceBox.module.css";

export interface SkillAudienceBoxProps {
  label?: string;
  roles?: string[];
  lastUpdated?: string;
  className?: string;
}

export const SkillAudienceBox: React.FC<SkillAudienceBoxProps> = ({
  label = "This skill is often used by",
  roles = ["Product Manager", "Graphic Designer", "Art Director"],
  lastUpdated = "Last updated Oct 3, 2026",
  className = "",
}) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      aria-label="Target audience roles"
    >
      <div className={styles.contentRow}>
        <span className={styles.label}>{label}</span>
        <div className={styles.pillsRow} role="list" aria-label="Target audience list">
          {roles.map((role) => (
            <Pill key={role} interactive={false} as="span" role="listitem">
              {role}
            </Pill>
          ))}
        </div>
      </div>

      <hr className={styles.divider} aria-hidden="true" />

      <span className={styles.updatedText}>{lastUpdated}</span>
    </div>
  );
};
