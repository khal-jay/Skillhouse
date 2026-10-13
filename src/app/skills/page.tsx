"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MarketplaceView, MARKETPLACE_SKILLS } from "@/components/features/MarketplaceView";
import { SkillDetailPage, DEFAULT_DETAIL_SKILL, SkillDetailData } from "@/components/features/SkillDetailPage";

function SkillsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id");
  const categoryParam =
    searchParams.get("category") ||
    searchParams.get("output") ||
    searchParams.get("role") ||
    searchParams.get("use-case") ||
    "";
  const searchParam = searchParams.get("search") || searchParams.get("q") || "";
  const loadingParam = searchParams.get("loading");

  // If a specific skill ID is requested via query param, display the full detail screen
  if (idParam) {
    const matchedSkill = MARKETPLACE_SKILLS.find((s) => s.id === idParam);
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
          thumbnails: [
            matchedSkill.previewImage || DEFAULT_DETAIL_SKILL.previewImage,
            "/figma/node_751_5608.png",
            "/figma/node_751_5609.png",
          ],
          models: matchedSkill.models,
          roles: DEFAULT_DETAIL_SKILL.roles,
        }
      : DEFAULT_DETAIL_SKILL;

    return (
      <SkillDetailPage
        skill={skillData}
        onBack={() => router.push("/skills")}
        onNavigateSkill={(id) => router.push(`/skills?id=${id}`)}
        onNavigateHome={() => router.push("/")}
        onNavigateMarketplace={() => router.push("/skills")}
      />
    );
  }

  return (
    <MarketplaceView
      isLoading={loadingParam === "true" || loadingParam === "1" ? true : undefined}
      initialCategory={categoryParam}
      initialSearch={searchParam}
      onNavigateHome={() => router.push("/")}
      onNavigateMySkills={() => router.push("/?view=my-skills")}
      onSelectSkillDetail={(id) => router.push(`/skills?id=${id}`)}
    />
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#FFEEDD" }} />}>
      <SkillsPageContent />
    </Suspense>
  );
}
