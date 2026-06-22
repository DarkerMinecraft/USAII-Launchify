import type { SafetyCategory } from "@/lib/types";

export const SAFETY_CATEGORY_LABELS = {
  ILLEGAL_GOODS_SERVICES: "illegal goods or services",
  VIOLENCE_PHYSICAL_HARM: "violence or serious physical harm",
  CBRN_WEAPONS: "weapons intended for mass harm",
  SELF_HARM_EATING_DISORDER: "the promotion or facilitation of self-harm",
  EXPLOITATION_COERCION_TRAFFICKING: "trafficking, coercion, or labor exploitation",
  CHILD_SAFETY_SEXUAL_ABUSE: "the exploitation or endangerment of minors",
  SEXUAL_ABUSE_NONCONSENSUAL_CONTENT: "sexual abuse or non-consensual intimate content",
  FRAUD_DECEPTION_IMPERSONATION: "fraud, impersonation, or deliberate deception",
  CYBER_HARM: "malicious or unauthorized cyber activity",
  PRIVACY_STALKING_SURVEILLANCE: "non-consensual surveillance, stalking, or privacy abuse",
  HATE_HARASSMENT_DISCRIMINATION: "targeted harassment, hate, or discrimination",
  EXTREMISM_TERRORISM: "terrorism or violent extremist support",
  REGULATORY_PROFESSIONAL_HARM: "dangerous evasion of professional or safety safeguards",
  HIGH_STAKES_RIGHTS_VIOLATION: "automated high-stakes decisions that deny people meaningful review",
  MANIPULATION_VULNERABILITY_EXPLOITATION: "coercive manipulation or exploitation of vulnerable people",
  CIVIC_DISINFORMATION: "coordinated civic deception or interference",
  RECKLESS_PUBLIC_SAFETY: "reckless conduct that creates a serious public-safety risk",
  ANIMAL_ENVIRONMENTAL_HARM: "deliberate animal cruelty or severe environmental harm",
} as const satisfies Record<SafetyCategory, string>;

export const HARD_BLOCK_CATEGORIES = new Set<SafetyCategory>([
  "CBRN_WEAPONS",
  "CHILD_SAFETY_SEXUAL_ABUSE",
  "SEXUAL_ABUSE_NONCONSENSUAL_CONTENT",
]);

export const isSafetyCategory = (value: unknown): value is SafetyCategory =>
  typeof value === "string" && Object.hasOwn(SAFETY_CATEGORY_LABELS, value);

export const buildSafetyRefusal = (category: SafetyCategory): string => {
  if (HARD_BLOCK_CATEGORIES.has(category)) {
    return "FOUNDR can't help develop this idea. It falls outside what this tool will engage with. FOUNDR is built to validate lawful, non-harmful businesses. You can submit a different idea.";
  }

  return `FOUNDR can't help develop this idea. It describes a business centered on ${SAFETY_CATEGORY_LABELS[category]}, which falls outside what this tool will assist with. FOUNDR is built to validate lawful, non-harmful businesses. If you think this was flagged in error, you can submit a different idea.`;
};
