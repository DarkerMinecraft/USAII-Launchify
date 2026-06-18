import type { QA } from "@/lib/types";

export function hasAnsweredQuestionnaire(questionnaire: QA[]): boolean {
  return questionnaire.some((q) => typeof q.answer === "string" && q.answer.trim().length > 0);
}
