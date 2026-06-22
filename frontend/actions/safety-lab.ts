"use server";

import { classifyIdea } from "@/actions/war-room";
import type { QA, SafetyVerdict } from "@/lib/types";

type LabSubmission = {
  ideaSummary: string;
  questionnaireResponses?: QA[];
};

const assertDevelopmentLab = () => {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("The guardrail lab is only available in local development.");
  }
};

const cleanSubmission = ({
  ideaSummary,
  questionnaireResponses = [],
}: LabSubmission): Required<LabSubmission> => {
  if (typeof ideaSummary !== "string" || !ideaSummary.trim()) {
    throw new Error("Enter an idea to classify.");
  }
  if (ideaSummary.length > 4_000) {
    throw new Error("Keep the idea under 4,000 characters.");
  }
  if (!Array.isArray(questionnaireResponses) || questionnaireResponses.length > 12) {
    throw new Error("The questionnaire context is invalid.");
  }

  const cleanedResponses = questionnaireResponses.map((item) => {
    if (
      !item ||
      typeof item.question !== "string" ||
      typeof item.answer !== "string" ||
      item.question.length > 1_000 ||
      item.answer.length > 4_000
    ) {
      throw new Error("The questionnaire context is invalid.");
    }
    return {
      question: item.question.trim(),
      answer: item.answer.trim(),
    };
  });

  return {
    ideaSummary: ideaSummary.trim(),
    questionnaireResponses: cleanedResponses,
  };
};

export const classifyLabSubmission = async (
  submission: LabSubmission
): Promise<SafetyVerdict> => {
  assertDevelopmentLab();
  const cleaned = cleanSubmission(submission);
  return classifyIdea(cleaned.ideaSummary, cleaned.questionnaireResponses);
};

