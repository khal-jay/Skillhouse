"use client";

import React, { useRef, useState } from "react";

export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  maxDistance?: number;
  className?: string;
  style?: React.CSSProperties;
  showDashedBorder?: boolean;
  activeColor?: string;
}

export const MagneticButton = ({
  children,
  strength = 0.8,
  maxDistance = 100,
  className = "",
  style,
  showDashedBorder = true,
  activeColor,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    let x = (clientX - (left + width / 2)) * strength;
    let y = (clientY - (top + height / 2)) * strength;

    const distance = Math.hypot(x, y);
    if (distance > maxDistance && distance > 0) {
      const scale = maxDistance / distance;
      x *= scale;
      y *= scale;
    }

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const hasMoved = position.x !== 0 || position.y !== 0;
  const borderColorVar = activeColor || "var(--show-color, #3b82f6)";

  return (
    <div
      data-testid="magnetic-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer rounded-lg border border-dashed transition-colors duration-150 [--show-color:var(--color-blue-500,#3b82f6)] ${className}`.trim()}
      style={{
        display: "inline-block",
        cursor: "pointer",
        borderRadius: "8px",
        border: showDashedBorder ? "1px dashed" : "1px solid transparent",
        borderColor: hasMoved && showDashedBorder ? borderColorVar : "transparent",
        backgroundColor:
          hasMoved && showDashedBorder
            ? `color-mix(in srgb, ${borderColorVar} 20%, transparent)`
            : "transparent",
        transition: "border-color 150ms ease, background-color 150ms ease",
        ...style,
      }}
    >
      <div
        ref={ref}
        data-testid="magnetic-inner"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: hasMoved
            ? "transform 150ms cubic-bezier(0.25, 1, 0.5, 1)"
            : "transform 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
