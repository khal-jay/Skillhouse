"use client";

import React, { useEffect, useRef, useState } from "react";
import { AsciiSlideData } from "./AsciiCanvas";
import styles from "./AsciiThumbnail.module.css";

export interface AsciiThumbnailProps {
  slideIndex: number;
  slide: AsciiSlideData;
  isActive?: boolean;
  className?: string;
}

// Aceternity UI ASCII Art Charsets
const ASCII_CHARSET = " .:-=+*#%@";

export const AsciiThumbnail: React.FC<AsciiThumbnailProps> = ({
  slideIndex,
  slide,
  isActive = false,
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

    const width = 240;
    const height = 64;
    const cols = 30;
    const rows = 8;
    const cellW = width / cols;
    const cellH = height / rows;

    // Offscreen canvas for rasterizing icon shapes (Aceternity UI approach)
    const offCanvas = document.createElement("canvas");
    offCanvas.width = cols;
    offCanvas.height = rows;
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const renderLoop = (time: number) => {
      const elapsed = (time - startTime) / 1000;

      // 1. Draw crisp Icon Geometry onto the low-res raster grid
      offCtx.clearRect(0, 0, cols, rows);

      if (slideIndex === 0) {
        // --- ICON 01: TERMINAL / PROMPT BRIEF ICON ---
        // Outer Terminal Window Frame
        offCtx.fillStyle = "#555555";
        offCtx.fillRect(1, 0, cols - 2, rows);
        offCtx.fillStyle = "#000000";
        offCtx.fillRect(2, 1, cols - 4, rows - 2);

        // Window Title Dots
        offCtx.fillStyle = "#FFFFFF";
        offCtx.fillRect(3, 1, 1, 1);
        offCtx.fillRect(5, 1, 1, 1);
        offCtx.fillRect(7, 1, 1, 1);

        // Header Title 'BRIEF'
        offCtx.fillRect(11, 1, 8, 1);

        // Prompt chevron '>_'
        offCtx.fillStyle = "#FFFFFF";
        offCtx.fillRect(4, 3, 2, 1);
        offCtx.fillRect(5, 4, 2, 1);
        offCtx.fillRect(4, 5, 2, 1);

        // Command line & blinking cursor
        offCtx.fillRect(8, 4, 12, 1);
        if (Math.floor(elapsed * 3) % 2 === 0) {
          offCtx.fillRect(21, 4, 2, 1); // Blinking cursor
        }

        // Subtext / hierarchy lines
        offCtx.fillStyle = "#888888";
        offCtx.fillRect(8, 6, 14, 1);
      } else if (slideIndex === 1) {
        // --- ICON 02: SPATIAL CANVAS / ARTBOARDS ICON ---
        // 3 Spatial Canvas Panels arranged in perspective
        const drawArtboard = (x: number, w: number, isCenter: boolean) => {
          offCtx.fillStyle = isCenter ? "#FFFFFF" : "#777777";
          offCtx.fillRect(x, 1, w, rows - 2);
          offCtx.fillStyle = "#000000";
          offCtx.fillRect(x + 1, 2, w - 2, rows - 4);
          // Artboard header bar
          offCtx.fillStyle = isCenter ? "#FFFFFF" : "#888888";
          offCtx.fillRect(x + 2, 3, w - 4, 1);
          // Artboard content card
          offCtx.fillRect(x + 2, 4, w - 4, 1);
        };

        drawArtboard(2, 7, false);
        drawArtboard(11, 8, true);
        drawArtboard(21, 7, false);

        // Spatial grid connectors
        offCtx.fillStyle = "#555555";
        offCtx.fillRect(9, 4, 2, 1);
        offCtx.fillRect(19, 4, 2, 1);
      } else {
        // --- ICON 03: PPTX PRESENTATION SLIDE DECK ICON ---
        // Presentation Monitor / Easel Screen
        offCtx.fillStyle = "#666666";
        offCtx.fillRect(3, 0, cols - 6, rows - 2);
        offCtx.fillStyle = "#000000";
        offCtx.fillRect(4, 1, cols - 8, rows - 4);

        // Slide presentation header
        offCtx.fillStyle = "#FFFFFF";
        offCtx.fillRect(6, 2, 4, 1); // [P] icon
        offCtx.fillRect(12, 2, 10, 1); // Title bar

        // Slide presentation chart bars
        offCtx.fillStyle = "#FFFFFF";
        offCtx.fillRect(7, 4, 2, 1);
        offCtx.fillRect(11, 4, 2, 1);
        offCtx.fillRect(15, 3, 2, 2);
        offCtx.fillRect(19, 3, 2, 2);

        // Monitor Base / Easel Stand
        offCtx.fillStyle = "#777777";
        offCtx.fillRect(cols / 2 - 2, rows - 2, 4, 1);
        offCtx.fillRect(cols / 2 - 4, rows - 1, 8, 1);
      }

      // 2. Read pixel buffer and convert to Aceternity ASCII Art
      const imgData = offCtx.getImageData(0, 0, cols, rows).data;
      ctx.clearRect(0, 0, width, height);

      // Warm background tint
      ctx.fillStyle = isActive
        ? "rgba(255, 247, 238, 0.98)"
        : isHovered
        ? "rgba(255, 236, 216, 0.85)"
        : "rgba(255, 244, 232, 0.45)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = "700 8.5px 'JetBrains Mono', monospace";
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offset = (r * cols + c) * 4;
          const rVal = imgData[offset];
          const gVal = imgData[offset + 1];
          const bVal = imgData[offset + 2];
          let brightness = (rVal + gVal + bVal) / 3;

          const x = c * cellW + 1;
          const y = r * cellH + 1;

          // Interactive mouse wave / disturbance (Aceternity UI feature)
          let mouseDisturbed = false;
          if (mousePosRef.current) {
            const dx = mousePosRef.current.x - (x + cellW / 2);
            const dy = mousePosRef.current.y - (y + cellH / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 40) {
              mouseDisturbed = true;
              const wave = Math.sin(dist * 0.2 - elapsed * 7);
              brightness = Math.min(255, Math.max(0, brightness + wave * 90));
            }
          }

          if (brightness > 15) {
            const charIdx = Math.floor((brightness / 255) * (ASCII_CHARSET.length - 1));
            let char = ASCII_CHARSET[charIdx] || "*";

            if (mouseDisturbed) {
              // Aceternity character scrambling during wave disturbance
              const scrambleIdx = Math.floor((elapsed * 12 + c + r) % ASCII_CHARSET.length);
              char = ASCII_CHARSET[scrambleIdx] || char;
              ctx.fillStyle = "#FB6320"; // Brand Orange highlight
            } else if (brightness > 180) {
              ctx.fillStyle = isActive ? "#FB6320" : isHovered ? "#000000" : "#FB6320";
            } else if (brightness > 90) {
              ctx.fillStyle = isActive ? "#111717" : isHovered ? "#2A1D17" : "#54392D";
            } else {
              ctx.fillStyle = "rgba(84, 57, 45, 0.4)";
            }

            ctx.fillText(char, x, y);
          } else {
            // Ambient subtle dot matrix in empty space
            if ((c + r) % 4 === 0 && (isHovered || isActive)) {
              ctx.fillStyle = "rgba(84, 57, 45, 0.12)";
              ctx.fillText(".", x, y);
            }
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [slideIndex, isActive, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 240,
      y: ((e.clientY - rect.top) / rect.height) * 64,
    };
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mousePosRef.current = null;
  };

  return (
    <div
      className={`${styles.thumbnailInner} ${isActive ? styles.active : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`ascii-thumbnail-inner-${slideIndex}`}
    >
      {/* 1. Header Badge Row */}
      <div className={styles.headerRow}>
        <span className={styles.badge}>{slide.badge}</span>
        <div className={styles.statusIndicator} aria-hidden="true">
          <span className={styles.pulseDot} />
        </div>
      </div>

      {/* 2. Aceternity ASCII Art Icon Stage */}
      <div className={styles.stageContainer} data-testid={`ascii-stage-${slideIndex}`}>
        <canvas
          ref={canvasRef}
          width={240}
          height={64}
          className={styles.microCanvas}
          data-testid={`ascii-canvas-thumb-${slideIndex}`}
          aria-hidden="true"
        />
        <div className={styles.scanline} aria-hidden="true" />
      </div>

      {/* 3. Footer Subtitle (Clean single-line, zero overlap) */}
      <div className={styles.footerRow}>
        <span className={styles.title} title={slide.title}>
          {slide.title}
        </span>
      </div>
    </div>
  );
};
