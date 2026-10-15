"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AsciiCanvas.module.css";

export interface AsciiCardThumbnailProps {
  title: string;
  category?: string;
  className?: string;
}

const DENSITY_CHARS = " .:-=+*#%@";

export const AsciiCardThumbnail: React.FC<AsciiCardThumbnailProps> = ({
  title,
  category = "Presentations",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();
    let prefersReducedMotion = false;

    if (typeof window !== "undefined") {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const width = 280;
    const height = 180;
    const cellW = 7;
    const cellH = 9;
    const cols = Math.floor(width / cellW);
    const rows = Math.floor(height / cellH);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Warm peach background
      ctx.fillStyle = isHovered ? "#FFF2E4" : "#FFECD8";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "7px monospace";
      ctx.textBaseline = "top";

      // Border outline
      ctx.strokeStyle = "rgba(84, 57, 45, 0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, width - 16, height - 16);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellW;
          const y = r * cellH;

          // Interactive wave from mouse
          let wave = 0;
          if (mousePosRef.current) {
            const dx = mousePosRef.current.x - x;
            const dy = mousePosRef.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60) {
              wave = Math.sin(dist * 0.15 - elapsed * 6) * 0.5;
            }
          }

          let char = " ";
          let color = "#54392D";

          // Draw stylized blueprint card wireframe
          if (r === 2 && c >= 3 && c <= 25) {
            const header = `[ ${title.toUpperCase().slice(0, 18)} ]`;
            char = header[c - 3] || " ";
            color = "#FB6320";
          } else if (r === 4 && c >= 3 && c <= 16) {
            char = "+--------------+";
            char = char[c - 3] || " ";
          } else if (r === 5 && c >= 3 && c <= 16) {
            const label = "| SLIDE CANVAS |";
            char = label[c - 3] || " ";
          } else if (r === 6 && c >= 3 && c <= 16) {
            char = "+--------------+";
            char = char[c - 3] || " ";
          } else if (r >= 8 && r <= 14 && c >= 3 && c <= 34) {
            // Live dynamic wave/matrix
            const noise = Math.sin(c * 0.4 + r * 0.3 + elapsed * 3) + wave;
            if (noise > 0.4) {
              const charIdx = Math.floor(((noise + 1) / 2) * (DENSITY_CHARS.length - 1));
              char = DENSITY_CHARS[charIdx] || "·";
              color = isHovered ? "#FB6320" : "#54392D";
            }
          } else if (r === 16 && c >= 3 && c <= 30) {
            const foot = `$ status: ready [100%]`;
            char = foot[c - 3] || " ";
            color = "rgba(127, 119, 110, 0.8)";
          }

          if (char !== " ") {
            ctx.fillStyle = color;
            ctx.fillText(char, x, y);
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [title, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 280,
      y: ((e.clientY - rect.top) / rect.height) * 180,
    };
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mousePosRef.current = null;
      }}
      onMouseMove={handleMouseMove}
      data-testid="ascii-card-thumbnail"
      aria-label={`${title} dynamic ASCII preview`}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        width={280}
        height={180}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          imageRendering: "pixelated",
        }}
      />
      <div className={styles.scanlineOverlay} aria-hidden="true" />
    </div>
  );
};
