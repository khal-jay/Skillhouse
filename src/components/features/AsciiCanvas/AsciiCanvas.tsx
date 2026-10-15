"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./AsciiCanvas.module.css";

export interface AsciiCanvasProps {
  activeSlideIndex?: number;
  onSlideChange?: (idx: number) => void;
  skillTitle?: string;
  category?: string;
}

export interface AsciiSlideData {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  artText: string;
}

export const VISUAL_CANVAS_SLIDES: AsciiSlideData[] = [
  {
    id: "deck-easel",
    title: "Prompt ➔ Spatial Outline",
    badge: "01: BRIEF",
    tagline: "Widescreen 16:9 spatial layout with modular metric clusters",
    artText: `                                                                   
                                                                   
   .............................................................   
   ...=======================================================...   
   ...|:::::::::::::::::::::::::::::::::::::::::::::::::::::|...   
   ...|:::SLIDE 01: AUTONOMOUS AGENT MESH:::::::::::::::::::|...   
   ...|:::-------------------------------------------:::::::|...   
   ...|:::::::::::::::::::::::::::::::::::::::::::::::::::::|...   
   ...|:::+++++++++++++++++++:::+++++++++++++++++++++++++:::|...   
   ...|:::|                 |:::|                       |:::|...   
   ...|:::| [ 01: BRIEF ]   |:::| [ BENCHMARK: -64% ]   |:::|...   
   ...|:::|                 |:::|                       |:::|...   
   ...|:::|                 |:::|            @@         |:::|...   
   ...|:::| • 38ms Latency  |:::|            @@         |:::|...   
   ...|:::|                 |:::|       ##   @@         |:::|...   
   ...|:::| • 12 Key Slides |:::|       ##   @@   %%    |:::|...   
   ...|:::|                 |:::|       ##   @@   %%    |:::|...   
   ...|:::| • PPTX Native   |:::|  ##   ##   @@   %%    |:::|...   
   ...|:::|                 |:::|  ##   ##   @@   %%    |:::|...   
   ...|:::|                 |:::|  ##   ##   @@   %%    |:::|...   
   ...|:::|                 |:::|  ##   ##   @@   %%    |:::|...   
   ...|:::|                 |:::|                       |:::|...   
   ...|:::+++++++++++++++++++:::+++++++++++++++++++++++++:::|...   
   ...|:::::::::::::::::::::::::::::::::::::::::::::::::::::|...   
   ...|:::::::::::::::::::::::::::::::::::::::::::::::::::::|...   
   ...|:::::::::::::::::::::::::::::::::::::::::::::::::::::|...   
   ...=======================================================...   
   .............................||..............................   
   .............................||..............................   
   .............................||..............................   
   .............................||..............................   
   .............................||..............................   
   ...................=======================...................   
   .............................................................   
   .............................................................   
                                                                   `,
  },
  {
    id: "spatial-grid",
    title: "Spatial Canvas Composition",
    badge: "02: CANVAS",
    tagline: "3-Tier hierarchy: Context ➔ Mechanism ➔ Outcome",
    artText: `                                                                   
                                                                   
   .............................................................   
   .............................................................   
   ........................#################....................   
   ........................#               #....................   
   ...=================....#02: MECHANISM  #....=================  
   ...|               |....#               #....|               |  
   ...| 01: CONTEXT   |....# • Tool Loop   #....| 03: OUTCOME   |  
   ...|               |....#               #....|               |  
   ...| • Problem     |....# • Agent Mesh  #....| • 64% Speed   |  
   ...|               |....#               #....|               |  
   ...| • Baseline    |---># • Sandboxed   #--->| • PPTX XML    |  
   ...|               |....#               #....|               |  
   ...=================....#               #....=================  
   ........................#################....................   
   .............................................................   
   .............................................................   
   .............................................................   
   ...[SPATIAL CANVAS]  1920x1080 16:9  •  OpenXML Native  •  Offl 
   ...=======================================================...   
   .............................................................   
   .............................................................   
   .............................................................   
   .............................................................   
                                                                   `,
  },
  {
    id: "pptx-artifact",
    title: "PowerPoint (.pptx) Compilation",
    badge: "03: PPTX",
    tagline: "Fully native OpenXML vectors ready for PowerPoint & Keynote",
    artText: `                                                                   
                                                                   
   .............................................................   
   .......................-----------------------------.........   
   .......................-:::::::::::::::::::::::::::-.........   
   ..................=============================::::-.........   
   ..................=:::::::::::::::::::::::::::=::::-.........   
   ...........###############################::::=::::-.........   
   ...........#  @@@@@@@@@                  #::::=::::-.........   
   ...........#  @   P   @  POWERPOINT (.PPTX):::=::::-.........   
   ...........#  @@@@@@@@@  100% Vector Primitives::::-.........   
   ...........#                             #::::=::::-.........   
   ...........#   • File     : deck.pptx (2.4 MB)=::::-.........   
   ...........#   • Schema   : ECMA-376 OpenXML::=..............   
   ...........#   • Standard : Unflattened Shapes=..............   
   ...........###############################...................   
   .............................................................   
   ...[VERIFIED ARTIFACT]  Ready for PowerPoint, Keynote & Google  
   ...=======================================================...   
   .............................................................   
   .............................................................   
   .............................................................   
                                                                   `,
  },
];

const DENSITY_CHARSET = " .:-=+*#%@";

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({
  activeSlideIndex = 0,
  skillTitle = "Visual Canvas Deck",
}) => {
  const [viewMode, setViewMode] = useState<"art" | "matrix">("art");
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const safeIndex = Math.max(0, Math.min(activeSlideIndex, VISUAL_CANVAS_SLIDES.length - 1));
  const activeSlide = VISUAL_CANVAS_SLIDES[safeIndex] || VISUAL_CANVAS_SLIDES[0];

  // Dynamic Aceternity Canvas Matrix when toggled
  useEffect(() => {
    if (viewMode !== "matrix") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const width = 540;
    const height = 360;
    const cellSize = 8;

    const renderLoop = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.font = `bold ${cellSize}px monospace`;

      const lines = activeSlide.artText.split("\n");
      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        const y = 20 + r * (cellSize + 1);
        for (let c = 0; c < line.length; c++) {
          const x = 16 + c * cellSize;
          let ch = line[c];

          let isPerturbed = false;
          if (mousePosRef.current) {
            const dx = mousePosRef.current.x - x;
            const dy = mousePosRef.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60) {
              isPerturbed = true;
              const randomIdx = Math.floor(Math.random() * DENSITY_CHARSET.length);
              ch = DENSITY_CHARSET[randomIdx];
            }
          }

          if (isPerturbed) {
            ctx.fillStyle = "#FB6320";
          } else if (ch === "#" || ch === "@" || ch === "%") {
            ctx.fillStyle = "#FB6320";
          } else if (ch === "=" || ch === "|" || ch === "+" || ch === "-") {
            ctx.fillStyle = "#241812";
          } else if (ch === ".") {
            ctx.fillStyle = "rgba(84, 57, 45, 0.2)";
          } else {
            ctx.fillStyle = "#1A1A1A";
          }

          if (ch && ch !== " ") {
            ctx.fillText(ch, x, y);
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode, safeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "matrix") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 540,
      y: ((e.clientY - rect.top) / rect.height) * 360,
    };
  };

  const renderArtWithHighlights = (text: string) => {
    return text.split("\n").map((line, rIdx) => (
      <div key={rIdx} className={styles.asciiLine}>
        {line.split("").map((ch, cIdx) => {
          let chClass = styles.chDefault;
          if (ch === ".") chClass = styles.chDot;
          else if (ch === "#" || ch === "@" || ch === "%") chClass = styles.chAccent;
          else if (ch === "=" || ch === "|" || ch === "+" || ch === "-") chClass = styles.chBorder;
          return (
            <span key={cIdx} className={chClass}>
              {ch}
            </span>
          );
        })}
      </div>
    ));
  };

  return (
    <div
      className={styles.canvasContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mousePosRef.current = null;
      }}
      onMouseMove={handleMouseMove}
      data-testid="ascii-canvas-container"
      aria-label={`${skillTitle} ASCII art canvas preview`}
    >
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.terminalControls} aria-hidden="true">
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
        </div>

        <div className={styles.statusTag}>
          <span className={styles.liveIndicator} />
          <span>{activeSlide.badge}</span>
        </div>

        <button
          type="button"
          className={styles.modeToggleBtn}
          onClick={() => setViewMode((m) => (m === "art" ? "matrix" : "art"))}
          aria-label={`Toggle view mode. Currently ${viewMode}`}
          title="Toggle between Shaded ASCII Art and Live Matrix"
        >
          {viewMode === "art" ? "Interactive Matrix" : "Shaded Art"}
        </button>
      </div>

      {/* Main Body */}
      <div className={styles.canvasBody}>
        {viewMode === "art" ? (
          <pre className={styles.asciiPre} data-testid="ascii-blueprint-pre">
            <code>{renderArtWithHighlights(activeSlide.artText)}</code>
          </pre>
        ) : (
          <canvas
            ref={canvasRef}
            width={540}
            height={360}
            className={styles.matrixCanvas}
            data-testid="ascii-matrix-canvas"
          />
        )}
        <div className={styles.scanlineOverlay} aria-hidden="true" />
      </div>

      {/* Footer Meta Bar */}
      <div className={styles.canvasFooter}>
        <span className={styles.metaBadge}>{activeSlide.title}</span>
        <span>Slide {safeIndex + 1} of {VISUAL_CANVAS_SLIDES.length}</span>
      </div>
    </div>
  );
};
