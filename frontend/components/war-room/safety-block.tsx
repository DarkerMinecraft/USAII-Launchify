"use client";

import { ShieldAlert } from "lucide-react";

// Shared refusal presentation for a BLOCK verdict (see .claude/GUARDRAIL.md §5).
// Rendered by both the intake Dialog (questionnaire) and the arena refusal card
// so the copy stays consistent. Shows no harmful detail and no rephrase coaching.
export type SafetyBlockInfo = { reason: string; category: string | null };

export const SafetyRefusal = ({ info }: { info: SafetyBlockInfo }) => {
  const reason = info.reason?.trim();
  const category = info.category?.trim();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-agent-skeptic/40 bg-[rgba(194,105,42,0.08)]">
          <ShieldAlert className="h-[18px] w-[18px] text-agent-skeptic" />
        </span>
        <span className="eyebrow font-mono">Idea not supported</span>
      </div>

      <h2 className="font-serif italic text-[22px] leading-[1.15] text-foreground">
        FOUNDR can&apos;t help develop this idea.
      </h2>

      <p className="text-[14px] leading-[1.6] text-text-muted">
        {reason
          ? reason
          : category
            ? `It describes a business centered on ${category}, which falls outside what this tool will assist with.`
            : "It falls outside what this tool will assist with."}
      </p>

      <p className="text-[13.5px] leading-[1.6] text-text-dim">
        FOUNDR is built to help validate lawful businesses. If you think this was
        flagged in error, you can submit a different idea.
      </p>
    </div>
  );
};
