"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Play,
  ShieldAlert,
  ShieldCheck,
  Square,
  XCircle,
} from "lucide-react";
import { classifyLabSubmission } from "@/actions/safety-lab";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SAFETY_CATEGORY_LABELS } from "@/lib/safety-policy";
import {
  SAFETY_QUICK_TEST_IDS,
  SAFETY_TEST_CASES,
  type SafetyTestCase,
} from "@/lib/safety-test-cases";
import type { SafetyVerdict } from "@/lib/types";

type CaseResult = {
  verdict?: SafetyVerdict;
  error?: string;
};

const QUICK_IDS = new Set<string>(SAFETY_QUICK_TEST_IDS);

const textareaClass =
  "min-h-0 resize-y rounded-[9px] border border-border bg-surface-3 px-[15px] py-3 text-sm leading-relaxed text-foreground placeholder:text-text-faint focus-visible:border-text-faint focus-visible:ring-1 focus-visible:ring-text-faint/20";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "The safety check failed.";

const waitForQuotaPacing = () =>
  new Promise((resolve) => window.setTimeout(resolve, 3_200));

export function GuardrailLab() {
  const [idea, setIdea] = useState("");
  const [context, setContext] = useState("");
  const [singleResult, setSingleResult] = useState<CaseResult | null>(null);
  const [checkingSingle, setCheckingSingle] = useState(false);
  const [results, setResults] = useState<Record<string, CaseResult>>({});
  const [running, setRunning] = useState(false);
  const [runTotal, setRunTotal] = useState(0);
  const stopRequested = useRef(false);

  const summary = useMemo(() => {
    const completed = SAFETY_TEST_CASES.filter((test) => results[test.id]?.verdict);
    const errors = SAFETY_TEST_CASES.filter((test) => results[test.id]?.error).length;
    const decisionPasses = completed.filter(
      (test) => results[test.id]?.verdict?.decision === test.expected
    ).length;
    const blockedWithExpectedCategory = completed.filter(
      (test) => test.expected === "BLOCK" && test.expectedCategory
    );
    const categoryPasses = blockedWithExpectedCategory.filter(
      (test) => results[test.id]?.verdict?.category === test.expectedCategory
    ).length;

    return {
      completed: completed.length,
      errors,
      decisionPasses,
      categoryTotal: blockedWithExpectedCategory.length,
      categoryPasses,
    };
  }, [results]);

  const checkIdea = async () => {
    if (!idea.trim()) return;
    setCheckingSingle(true);
    setSingleResult(null);
    try {
      const verdict = await classifyLabSubmission({
        ideaSummary: idea,
        questionnaireResponses: context.trim()
          ? [{ question: "Additional founder context", answer: context }]
          : [],
      });
      setSingleResult({ verdict });
    } catch (error) {
      setSingleResult({ error: getErrorMessage(error) });
    } finally {
      setCheckingSingle(false);
    }
  };

  const runSuite = async (tests: SafetyTestCase[]) => {
    if (running) return;
    stopRequested.current = false;
    setRunning(true);
    setRunTotal(tests.length);
    setResults({});

    for (const test of tests) {
      if (stopRequested.current) break;
      try {
        const verdict = await classifyLabSubmission({
          ideaSummary: test.ideaSummary,
          questionnaireResponses: test.questionnaireResponses,
        });
        setResults((current) => ({ ...current, [test.id]: { verdict } }));
      } catch (error) {
        setResults((current) => ({
          ...current,
          [test.id]: { error: getErrorMessage(error) },
        }));
      }
      if (!stopRequested.current) await waitForQuotaPacing();
    }

    setRunning(false);
  };

  const quickTests = SAFETY_TEST_CASES.filter((test) => QUICK_IDS.has(test.id));

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-hairline pb-7">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to FOUNDR
            </Link>
            <div className="eyebrow mb-3 flex items-center gap-2 font-mono text-agent-skeptic">
              <FlaskConical className="h-3.5 w-3.5" />
              Local development only
            </div>
            <h1 className="font-serif text-[34px] font-semibold italic leading-[1.05] text-foreground sm:text-[42px]">
              Guardrail Lab
            </h1>
            <p className="mt-3 max-w-[650px] text-[14.5px] leading-[1.7] text-text-muted">
              This mirrors the idea intake without Auth0, persistence, question generation, or a War Room.
              It calls the exact production classifier and keeps every test submission ephemeral.
            </p>
          </div>
          <div className="max-w-[320px] rounded-[10px] border border-border bg-surface-2 p-4 font-mono text-[9.5px] uppercase leading-[1.65] tracking-[0.08em] text-text-dim">
            This route and its server action return 404/refuse execution outside local development.
            Do not use it as a production moderation console.
          </div>
        </div>

        <section className="grid gap-8 py-9 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="rounded-[14px] border border-border-strong bg-surface-2 p-5 sm:p-7">
            <p className="eyebrow mb-3 font-mono">Intake replica</p>
            <h2 className="font-serif text-[25px] italic text-foreground">What are you building?</h2>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-text-muted">
              Try euphemisms, mixed intent, unusual framing, or a harmless idea with risky vocabulary.
            </p>

            <div className="mt-6">
              <Label htmlFor="lab-idea" className="eyebrow mb-2 block font-mono">
                Idea summary
              </Label>
              <Textarea
                id="lab-idea"
                autoFocus
                rows={5}
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value);
                  setSingleResult(null);
                }}
                placeholder="Describe the actual product, customer, and operating method…"
                className={textareaClass}
              />
            </div>

            <div className="mt-5">
              <Label htmlFor="lab-context" className="eyebrow mb-2 block font-mono">
                Later questionnaire context · optional
              </Label>
              <Textarea
                id="lab-context"
                rows={4}
                value={context}
                onChange={(event) => {
                  setContext(event.target.value);
                  setSingleResult(null);
                }}
                placeholder="Use this to test intent revealed after the one-liner…"
                className={textareaClass}
              />
            </div>

            <Button
              onClick={() => void checkIdea()}
              disabled={!idea.trim() || checkingSingle}
              className="btn-primary mt-6"
            >
              {checkingSingle ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {checkingSingle ? "Reasoning about the idea…" : "Run safety check"}
            </Button>

            {singleResult && <VerdictPanel result={singleResult} />}
          </div>

          <div className="rounded-[14px] border border-border-strong bg-surface-1 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3 font-mono">Adversarial evaluation</p>
                <h2 className="font-serif text-[25px] italic text-foreground">Paired stress suite</h2>
                <p className="mt-2 max-w-[520px] text-[13.5px] leading-[1.6] text-text-muted">
                  Harmful cases test obfuscation, prompt injection, multilingual text, and split context.
                  Benign neighbors measure overblocking. Runs are deliberately paced to respect provider quotas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {running ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      stopRequested.current = true;
                    }}
                  >
                    <Square className="h-3.5 w-3.5" />
                    Stop after current
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => void runSuite(quickTests)}>
                      <Play className="h-3.5 w-3.5" />
                      Quick · {quickTests.length}
                    </Button>
                    <Button className="btn-primary" onClick={() => void runSuite(SAFETY_TEST_CASES)}>
                      <Play className="h-3.5 w-3.5" />
                      Full · {SAFETY_TEST_CASES.length}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Completed" value={`${summary.completed}/${runTotal || "—"}`} />
              <Metric
                label="Decision accuracy"
                value={summary.completed ? `${summary.decisionPasses}/${summary.completed}` : "—"}
                tone={summary.completed && summary.decisionPasses !== summary.completed ? "warn" : "default"}
              />
              <Metric
                label="Category accuracy"
                value={summary.categoryTotal ? `${summary.categoryPasses}/${summary.categoryTotal}` : "—"}
                tone={summary.categoryTotal && summary.categoryPasses !== summary.categoryTotal ? "warn" : "default"}
              />
              <Metric label="Provider errors" value={String(summary.errors)} tone={summary.errors ? "warn" : "default"} />
            </div>

            <div className="mt-6 max-h-[660px] space-y-2 overflow-y-auto pr-1">
              {SAFETY_TEST_CASES.map((test) => (
                <TestRow key={test.id} test={test} result={results[test.id]} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function VerdictPanel({ result }: { result: CaseResult }) {
  if (result.error) {
    return (
      <div className="mt-6 rounded-[10px] border border-agent-skeptic/40 bg-[rgba(194,105,42,0.07)] p-4 text-[13px] leading-[1.6] text-agent-skeptic">
        {result.error}
      </div>
    );
  }

  if (!result.verdict) return null;
  const blocked = result.verdict.decision === "BLOCK";

  return (
    <div
      className={`mt-6 rounded-[10px] border p-4 ${
        blocked
          ? "border-agent-skeptic/45 bg-[rgba(194,105,42,0.07)]"
          : "border-agent-operator/45 bg-[rgba(111,163,126,0.07)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {blocked ? (
          <ShieldAlert className="h-4 w-4 text-agent-skeptic" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-agent-operator" />
        )}
        <span className={`font-mono text-[10px] font-medium tracking-[0.12em] ${blocked ? "text-agent-skeptic" : "text-agent-operator"}`}>
          {result.verdict.decision}
        </span>
      </div>
      {result.verdict.category && (
        <p className="mt-3 font-mono text-[9.5px] uppercase leading-[1.5] tracking-[0.08em] text-text-dim">
          {result.verdict.category} · {SAFETY_CATEGORY_LABELS[result.verdict.category]}
        </p>
      )}
      <p className="mt-3 text-[13.5px] leading-[1.6] text-text-muted">
        {blocked
          ? result.verdict.reason
          : "No prohibited core purpose was established from the submitted context."}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="rounded-[9px] border border-border bg-surface-3 px-3 py-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-text-faint">{label}</p>
      <p className={`mt-1.5 font-serif text-[20px] ${tone === "warn" ? "text-agent-skeptic" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function TestRow({ test, result }: { test: SafetyTestCase; result?: CaseResult }) {
  const decisionMatches = result?.verdict?.decision === test.expected;
  const categoryMatches =
    !test.expectedCategory || result?.verdict?.category === test.expectedCategory;
  const hasCategoryDrift = Boolean(result?.verdict && decisionMatches && !categoryMatches);

  return (
    <div className="rounded-[9px] border border-hairline bg-surface-2 px-3.5 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-foreground">{test.label}</p>
          <p className="mt-1 line-clamp-2 text-[11.5px] leading-[1.45] text-text-dim">
            {test.ideaSummary}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`font-mono text-[8.5px] tracking-[0.09em] ${test.expected === "BLOCK" ? "text-agent-skeptic" : "text-agent-operator"}`}>
            EXPECT {test.expected}
          </span>
          {!result ? (
            <span className="h-4 w-4 rounded-full border border-border" />
          ) : result.error ? (
            <XCircle className="h-4 w-4 text-agent-skeptic" />
          ) : decisionMatches ? (
            <CheckCircle2 className="h-4 w-4 text-agent-operator" />
          ) : (
            <XCircle className="h-4 w-4 text-agent-skeptic" />
          )}
        </div>
      </div>
      {result?.verdict && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline pt-2 font-mono text-[8.5px] uppercase tracking-[0.08em] text-text-faint">
          <span>Actual {result.verdict.decision}</span>
          {result.verdict.category && <span>{result.verdict.category}</span>}
          {hasCategoryDrift && <span className="text-agent-skeptic">Decision safe · category drift</span>}
        </div>
      )}
      {result?.error && (
        <p className="mt-2 border-t border-hairline pt-2 text-[11px] text-agent-skeptic">{result.error}</p>
      )}
    </div>
  );
}
