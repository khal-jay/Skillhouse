"use client";
import React, { useState } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function MagneticButtonDemo() {
  const [clickedText, setClickedText] = useState("");

  const handleClick = (name: string) => {
    setClickedText(`Clicked: ${name}`);
    setTimeout(() => setClickedText(""), 2000);
  };

  return (
    <div
      className="flex h-[40rem] w-full flex-col items-center justify-center gap-8"
      style={{
        minHeight: "40rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        backgroundColor: "#0d0f12",
        color: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Magnetic Button Interaction
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#9ca3af" }}>
          Hover and move cursor around the buttons to experience the spring-loaded magnetic pull effect.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
        {/* Original 21st.dev / Aceternity demo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#60a5fa" }}>
            21st.dev Preset (Dashed Guide)
          </span>
          <MagneticButton>
            <button
              onClick={() => handleClick("@mannupaaji")}
              className="cursor-pointer rounded-lg bg-linear-to-b from-blue-500 to-blue-700 px-4 py-2 font-medium text-white ring-1 ring-white/20 ring-offset-1 ring-offset-blue-500 transition-transform duration-150 ring-inset active:scale-98"
              style={{
                cursor: "pointer",
                borderRadius: "8px",
                background: "linear-gradient(to bottom, #3b82f6, #1d4ed8)",
                padding: "8px 16px",
                fontWeight: 500,
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 0 0 1px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)",
                outline: "none",
              }}
            >
              Follow @mannupaaji
            </button>
          </MagneticButton>
        </div>

        {/* Skillhouse Signature Orange Preset */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#FB6320" }}>
            Skillhouse Brand (Clean Magnet)
          </span>
          <MagneticButton showDashedBorder={false} strength={0.6} maxDistance={60} activeColor="#FB6320">
            <button
              onClick={() => handleClick("Skillhouse Get Started")}
              style={{
                cursor: "pointer",
                borderRadius: "40px",
                backgroundColor: "#FB6320",
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: "14px",
                color: "#000000",
                border: "none",
                boxShadow: "0 4px 16px rgba(251, 99, 32, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "transform 150ms ease",
              }}
            >
              Get Started
            </button>
          </MagneticButton>
        </div>

        {/* Skillhouse Request Skill Preset */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
            Secondary Dark Preset
          </span>
          <MagneticButton showDashedBorder={false} strength={0.5} maxDistance={50}>
            <button
              onClick={() => handleClick("Request a Skill")}
              style={{
                cursor: "pointer",
                borderRadius: "40px",
                backgroundColor: "#1c1c1e",
                padding: "10px 20px",
                fontWeight: 500,
                fontSize: "14px",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Request a skill
            </button>
          </MagneticButton>
        </div>
      </div>

      {clickedText && (
        <div
          role="status"
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#e5e7eb",
          }}
        >
          {clickedText}
        </div>
      )}
    </div>
  );
}
