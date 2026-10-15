"use client";

import React from "react";
import styles from "./Pill.module.css";

export interface PillProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
  interactive?: boolean;
  as?: "button" | "span";
  disabled?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  children,
  isSelected = false,
  className = "",
  interactive = true,
  as,
  ...props
}) => {
  const Component = as || (interactive ? "button" : "span");
  const isButton = Component === "button";

  return (
    <Component
      type={isButton ? "button" : undefined}
      className={`${styles.pill} ${isSelected ? styles.selected : ""} ${
        !interactive ? styles.static : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
