"use client";

import { useState, useCallback, useMemo } from "react";
import { ReactFlow, Background, type Node, type NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, CheckCircle, AlertCircle, HelpCircle, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { AssumptionNode, AssumptionStatus, Canvas, QA } from "@/lib/types";
import { updateSession } from "@/actions/sessions";

const STATUS_CFG = {
  UNVALIDATED: {
    label: "Unvalidated",
    color: "#c2692a",
    bg: "rgba(194,105,42,0.14)",
    border: "rgba(194,105,42,0.55)",
    w: 224, h: 114,
    icon: AlertCircle,
    colX: 30,
    bgClass: "bg-[rgba(194,105,42,0.14)] border-[rgba(194,105,42,0.55)]",
    iconClass: "text-[#c2692a]",
    labelClass: "text-[#c2692a]",
  },
  NEEDS_INFO: {
    label: "Needs Info",
    color: "#9a958c",
    bg: "rgba(90,87,79,0.10)",
    border: "rgba(90,87,79,0.38)",
    w: 196, h: 98,
    icon: HelpCircle,
    colX: 294,
    bgClass: "bg-[rgba(90,87,79,0.10)] border-[rgba(90,87,79,0.38)]",
    iconClass: "text-[#9a958c]",
    labelClass: "text-[#9a958c]",
  },
  VALIDATED: {
    label: "Validated",
    color: "#6fa37e",
    bg: "rgba(74,124,89,0.09)",
    border: "rgba(111,163,126,0.35)",
    w: 170, h: 84,
    icon: CheckCircle,
    colX: 530,
    bgClass: "bg-[rgba(74,124,89,0.09)] border-[rgba(111,163,126,0.35)]",
    iconClass: "text-agent-operator",
    labelClass: "text-agent-operator",
  },
} as const;

const AGENT_COLOR: Record<string, string> = {
  SKEPTIC: "#c2692a",
  STRATEGIST: "#6f93c4",
  OPERATOR: "#6fa37e",
};
const AGENT_CLASS: Record<string, string> = {
  SKEPTIC: "text-agent-skeptic",
  STRATEGIST: "text-agent-strategist",
  OPERATOR: "text-agent-operator",
};
const AGENT_NAME: Record<string, string> = {
  SKEPTIC: "The Skeptic",
  STRATEGIST: "The Strategist",
  OPERATOR: "The Operator",
};

const computeNodes = (assumptions: AssumptionNode[]): Node[] => {
  const counts: Record<AssumptionStatus, number> = {
    UNVALIDATED: 0, NEEDS_INFO: 0, VALIDATED: 0,
  };
  return assumptions.map((a) => {
    const cfg = STATUS_CFG[a.status];
    const row = counts[a.status]++;
    return {
      id: a.id,
      type: "assumption",
      position: { x: cfg.colX, y: 30 + row * (cfg.h + 22) },
      data: { assumption: a },
      draggable: false,
      selectable: true,
      style: { width: cfg.w },
    };
  });
};

const AssumptionFlowNode = ({ data }: { data: Record<string, unknown> }) => {
  const assumption = data.assumption as AssumptionNode;
  const cfg = STATUS_CFG[assumption.status];
  const Icon = cfg.icon;
  const reviewed = assumption.remediation !== null;

  return (
    <div
      className={cn(
        "rounded-[11px] py-[12px] px-[14px] cursor-pointer border transition-opacity duration-300",
        cfg.bgClass,
        reviewed ? "opacity-[0.65]" : "opacity-100"
      )}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={cn("w-[10px] h-[10px] shrink-0", cfg.iconClass)} />
        <span className={cn("font-mono uppercase text-[8px] tracking-[0.14em]", cfg.labelClass)}>
          {cfg.label}{reviewed ? " · reviewed" : ""}
        </span>
      </div>
      <p className="font-serif text-foreground text-[12px] leading-[1.4] m-0 line-clamp-3">
        {assumption.claim}
      </p>
      <div className={cn("font-mono uppercase mt-2 text-[7.5px] tracking-[0.12em]", AGENT_CLASS[assumption.agentSource] ?? "text-text-faint")}>
        {AGENT_NAME[assumption.agentSource] ?? assumption.agentSource}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = { assumption: AssumptionFlowNode };

interface Props {
  sessionId: string;
  assumptions: AssumptionNode[];
  ideaSummary: string;
  questionnaire: QA[];
}

export const AssumptionMap = ({ sessionId, assumptions: initial, ideaSummary, questionnaire }: Props) => {
  const [assumptions, setAssumptions] = useState(initial);
  const [selected, setSelected] = useState<AssumptionNode | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const nodes = useMemo(() => computeNodes(assumptions), [assumptions]);

  const counts = useMemo(() => ({
    unvalidated: assumptions.filter((a) => a.status === "UNVALIDATED").length,
    needsInfo: assumptions.filter((a) => a.status === "NEEDS_INFO").length,
    validated: assumptions.filter((a) => a.status === "VALIDATED").length,
  }), [assumptions]);

  const patchCanvas = useCallback(async (updated: AssumptionNode[]) => {
    setSaving(true);
    setSaveError(false);
    const canvas: Canvas = {
      ideaSummary,
      questionnaireResponses: questionnaire,
      assumptions: updated,
      lastUpdated: new Date().toISOString(),
    };
    try {
      await updateSession(sessionId, { canvas, assumptions: updated });
    } catch {
      setSaveError(true);
      toast.error("Could not save — changes may be lost.");
    } finally {
      setSaving(false);
    }
  }, [sessionId, ideaSummary, questionnaire]);

  const handleRemediate = useCallback((
    nodeId: string,
    action: "VALIDATE" | "MODIFY" | "REMOVE",
    payload: Record<string, string>,
  ) => {
    setAssumptions((prev) => {
      let updated: AssumptionNode[];
      if (action === "REMOVE") {
        updated = prev.filter((a) => a.id !== nodeId);
      } else if (action === "MODIFY") {
        updated = prev.map((a) =>
          a.id === nodeId
            ? { ...a, claim: payload.claim ?? a.claim, remediation: { action: "MODIFY", howTested: "", whatFound: "", resolvedAt: new Date().toISOString() } }
            : a
        );
      } else {
        updated = prev.map((a) =>
          a.id === nodeId
            ? { ...a, status: "VALIDATED" as AssumptionStatus, remediation: { action: "VALIDATE", howTested: payload.howTested ?? "", whatFound: payload.whatFound ?? "", resolvedAt: new Date().toISOString() } }
            : a
        );
      }
      void patchCanvas(updated);
      return updated;
    });
    setSelected(null);
  }, [patchCanvas]);

  const selectedNode = selected ? (assumptions.find((a) => a.id === selected.id) ?? null) : null;

  return (
    <div className="flex flex-col min-h-screen bg-war-room-bg">

      <div className="flex items-center gap-3 px-6 py-3 shrink-0 bg-[rgba(194,105,42,0.07)] border-b border-[rgba(194,105,42,0.22)]">
        <Info className="w-3.5 h-3.5 shrink-0 text-agent-skeptic" />
        <p className="font-mono uppercase flex-1 text-text-muted text-[9px] tracking-[0.1em]">
          This analysis is based entirely on what you told us — it does not replace talking to real customers.
          The AI does not decide whether your idea is worth pursuing.
        </p>
        {saving && <Loader2 className="w-3 h-3 animate-spin shrink-0 text-text-faint" />}
        {saveError && !saving && (
          <span className="font-mono uppercase shrink-0 text-agent-skeptic text-[8px] tracking-[0.1em]">
            Save failed
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 sm:px-8 py-4 sm:py-5 gap-3 shrink-0 border-b border-border">
        <div>
          <h1 className="font-serif italic text-foreground text-[22px] leading-[1.1]">
            Your Assumption Map
          </h1>
          <p className="font-mono uppercase mt-1 text-text-faint text-[9px] tracking-[0.14em]">
            {assumptions.length} assumption{assumptions.length !== 1 ? "s" : ""} · tap any node to review
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {counts.unvalidated > 0 && <StatusPill count={counts.unvalidated} status="UNVALIDATED" />}
          {counts.needsInfo > 0 && <StatusPill count={counts.needsInfo} status="NEEDS_INFO" />}
          {counts.validated > 0 && <StatusPill count={counts.validated} status="VALIDATED" />}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 h-[calc(100dvh-200px)]">
          <ReactFlow
            nodes={nodes}
            edges={[]}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => {
              const a = assumptions.find((x) => x.id === node.id);
              if (a) setSelected(a);
            }}
            fitView
            fitViewOptions={{ padding: 0.28 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag={true}
            zoomOnScroll={true}
            minZoom={0.4}
            maxZoom={1.6}
            className="bg-transparent"
          >
            <Background color="#252320" gap={28} size={1} />
          </ReactFlow>
        </div>

        {/* Desktop side panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="hidden md:flex w-[340px] bg-surface-1 border-l border-border flex-col overflow-y-auto"
            >
              <NodePanel node={selectedNode} onClose={() => setSelected(null)} onRemediate={handleRemediate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              key={`sheet-${selectedNode.id}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[78dvh] bg-surface-1 border-t border-border rounded-t-[20px] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-9 h-1 rounded-full bg-[#3a3833]" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <NodePanel node={selectedNode} onClose={() => setSelected(null)} onRemediate={handleRemediate} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-8 py-4 shrink-0 border-t border-border">
        <p className="font-serif italic text-text-dim text-[13px] max-w-[30rem]">
          Review your assumptions, then take your first real step in the Launchpad.
        </p>
        <Button asChild className="gap-2.5 rounded-[9px] px-5 py-2.5 text-[14px] font-semibold shrink-0">
          <Link href={`/launchpad?sessionId=${sessionId}`}>
            Open the Launchpad
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const StatusPill = ({ count, status }: { count: number; status: AssumptionStatus }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-mono uppercase py-1 px-2.5 rounded-[5px] text-[9px] tracking-[0.12em] border",
      cfg.bgClass, cfg.labelClass
    )}>
      {count} {cfg.label}
    </span>
  );
};

const NodePanel = ({
  node,
  onClose,
  onRemediate,
}: {
  node: AssumptionNode;
  onClose: () => void;
  onRemediate: (id: string, action: "VALIDATE" | "MODIFY" | "REMOVE", payload: Record<string, string>) => void;
}) => {
  const [action, setAction] = useState<"VALIDATE" | "MODIFY" | "REMOVE" | null>(null);
  const [howTested, setHowTested] = useState("");
  const [whatFound, setWhatFound] = useState("");
  const [modifiedClaim, setModifiedClaim] = useState(node.claim);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const cfg = STATUS_CFG[node.status];
  const Icon = cfg.icon;

  const canSubmit =
    (action === "VALIDATE" && howTested.trim().length > 0 && whatFound.trim().length > 0) ||
    (action === "MODIFY" && modifiedClaim.trim().length > 0 && modifiedClaim !== node.claim) ||
    (action === "REMOVE" && confirmRemove);

  const submit = () => {
    if (!canSubmit || !action) return;
    if (action === "VALIDATE") onRemediate(node.id, "VALIDATE", { howTested, whatFound });
    else if (action === "MODIFY") onRemediate(node.id, "MODIFY", { claim: modifiedClaim });
    else onRemediate(node.id, "REMOVE", {});
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-[13px] h-[13px]", cfg.iconClass)} />
          <span className={cn(
            "inline-flex items-center font-mono uppercase text-[9px] tracking-[0.12em] py-0.5 px-2 rounded-[4px] border",
            cfg.bgClass, cfg.labelClass
          )}>
            {cfg.label}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onClose} variant="ghost" size="icon-sm" className="text-text-faint">
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-5 p-5 overflow-y-auto">
        <div>
          <SectionLabel>Assumption</SectionLabel>
          <p className="font-serif text-foreground text-[15px] leading-[1.5] mt-[6px]">
            {node.claim}
          </p>
        </div>

        <span className={cn("font-mono uppercase text-[8.5px] tracking-[0.12em]", AGENT_CLASS[node.agentSource] ?? "text-text-faint")}>
          Raised by {AGENT_NAME[node.agentSource] ?? node.agentSource}
        </span>

        <div>
          <SectionLabel>Why this status</SectionLabel>
          <p className="text-text-muted text-[13px] leading-[1.55] mt-[6px]">
            {node.explanation}
          </p>
        </div>

        {node.howToTest && (
          <div className="bg-[rgba(194,105,42,0.07)] border border-[rgba(194,105,42,0.24)] rounded-[9px] py-[12px] px-[14px]">
            <p className="font-mono uppercase mb-2 text-agent-skeptic text-[8px] tracking-[0.13em]">
              How to test this
            </p>
            <p className="text-foreground text-[12.5px] leading-[1.5]">
              {node.howToTest}
            </p>
          </div>
        )}

        <p className="font-serif italic text-text-faint border-t border-border text-[11.5px] leading-[1.5] pt-[14px]">
          This status was AI-inferred from only what you told us. Verify before trusting it.
        </p>

        {node.remediation && (
          <div className="bg-[rgba(74,124,89,0.08)] border border-[rgba(111,163,126,0.25)] rounded-[9px] py-[12px] px-[14px]">
            <p className="font-mono uppercase text-agent-operator text-[8px] tracking-[0.12em]">
              You reviewed this assumption
            </p>
          </div>
        )}

        {!node.remediation && (
          <div className="flex flex-col gap-5">
            <Separator className="bg-border" />
            <div>
              <SectionLabel>What do you want to do?</SectionLabel>
              <div className="flex flex-col gap-2 mt-3">
                {(["VALIDATE", "MODIFY", "REMOVE"] as const).map((a) => (
                  <Button
                    key={a}
                    onClick={() => setAction(action === a ? null : a)}
                    variant={action === a ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start font-mono uppercase text-[9px] tracking-[0.1em] rounded-[7px] h-auto py-2 px-3",
                      action === a ? "text-foreground" : "text-text-dim"
                    )}
                  >
                    {a === "VALIDATE" ? "Validate this" : a === "MODIFY" ? "Modify the claim" : "Remove this assumption"}
                  </Button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {action === "VALIDATE" && (
                  <motion.div key="v" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 mt-4">
                    <FieldTextarea label="How did you test this?" value={howTested} onChange={setHowTested} placeholder="e.g. Interviewed 5 founders who faced this problem…" />
                    <FieldTextarea label="What did you find?" value={whatFound} onChange={setWhatFound} placeholder="e.g. All confirmed they spend 3+ hours a week on this…" />
                  </motion.div>
                )}
                {action === "MODIFY" && (
                  <motion.div key="m" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
                    <FieldTextarea label="Updated claim" value={modifiedClaim} onChange={setModifiedClaim} rows={3} />
                  </motion.div>
                )}
                {action === "REMOVE" && (
                  <motion.div key="r" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="confirm-remove"
                        checked={confirmRemove}
                        onCheckedChange={(c) => setConfirmRemove(c === true)}
                        className="mt-0.5 shrink-0 border-[#5a574f] data-checked:bg-[#c2692a] data-checked:border-[#c2692a]"
                      />
                      <label
                        htmlFor="confirm-remove"
                        className="cursor-pointer text-text-muted text-[12px] leading-[1.5]"
                      >
                        This assumption will be excluded from your Launchpad brief.
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {action && (
                <Button
                  onClick={submit}
                  disabled={!canSubmit}
                  className="w-full mt-4"
                >
                  Confirm
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow-sm">{children}</p>
);

const FieldTextarea = ({ label, value, onChange, placeholder, rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) => (
  <div className="flex flex-col gap-1.5">
    <ShadcnLabel className="eyebrow-sm">{label}</ShadcnLabel>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-surface-2 border border-border-strong rounded-[7px] px-[10px] py-2 text-foreground text-[12.5px] leading-relaxed resize-y placeholder:text-text-faint focus-visible:border-text-faint focus-visible:ring-1 focus-visible:ring-text-faint/20 min-h-0"
    />
  </div>
);

// Keep AGENT_COLOR for any external references that may still need it
export { AGENT_COLOR };
