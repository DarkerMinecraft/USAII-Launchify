import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuardrailLab } from "@/components/war-room/guardrail-lab";

export const metadata: Metadata = {
  title: "Guardrail Lab",
  description: "Local development harness for the FOUNDR idea-safety classifier.",
  robots: { index: false, follow: false },
};

const GuardrailLabPage = () => {
  if (process.env.NODE_ENV !== "development") notFound();
  return <GuardrailLab />;
};

export default GuardrailLabPage;

