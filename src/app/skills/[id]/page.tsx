"use client";

import React, { use } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  SkillDetailPage,
  DEFAULT_DETAIL_SKILL,
  SkillDetailData,
} from "@/components/features/SkillDetailPage";
import { MARKETPLACE_SKILLS } from "@/components/features/MarketplaceView";

interface SkillPageProps {
  params?: Promise<{ id: string }> | { id: string };
}

function isPromise(obj: unknown): obj is Promise<{ id: string }> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "then" in obj &&
    typeof (obj as { then: unknown }).then === "function"
  );
}

export default function SkillDynamicPage({ params }: SkillPageProps) {
  const router = useRouter();
  const routeParams = useParams();

  // Explicit params take precedence when passed (e.g. from tests or RSC wrapper),
  // otherwise fallback to useParams()
  let skillId: string | undefined;
  if (params) {
    if (isPromise(params)) {
      const resolved = use(params);
      skillId = resolved?.id;
    } else {
      skillId = params.id;
    }
  } else if (routeParams?.id) {
    skillId = Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;
  }

  skillId = skillId || "visual-canvas-deck";

  // Find matching skill from marketplace skills or default
  const matchedSkill = MARKETPLACE_SKILLS.find((s) => s.id === skillId);

  const skillData: SkillDetailData = matchedSkill
    ? {
        id: matchedSkill.id,
        title: matchedSkill.title,
        version: matchedSkill.version,
        price: matchedSkill.price,
        isFree: matchedSkill.isFree,
        category: matchedSkill.category,
        description: matchedSkill.description,
        installPrompt: matchedSkill.installPrompt,
        previewImage: matchedSkill.previewImage || DEFAULT_DETAIL_SKILL.previewImage,
        thumbnails:
          matchedSkill.id === "visual-canvas-deck" || !matchedSkill.previewImage
            ? [
                "/figma/visual_canvas_deck_slide1.png",
                "/figma/visual_canvas_deck_slide2.png",
                "/figma/visual_canvas_deck_slide3.png",
              ]
            : [
                matchedSkill.previewImage,
                "/figma/visual_canvas_deck_slide2.png",
                "/figma/visual_canvas_deck_slide3.png",
              ],
        models: matchedSkill.models,
        roles: DEFAULT_DETAIL_SKILL.roles,
      }
    : DEFAULT_DETAIL_SKILL;

  return (
    <SkillDetailPage
      skill={skillData}
      onBack={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/skills");
        }
      }}
      onNavigateSkill={(id) => router.push(`/skills/${id}`)}
      onNavigateHome={() => router.push("/")}
      onNavigateMarketplace={() => router.push("/skills")}
    />
  );
}
