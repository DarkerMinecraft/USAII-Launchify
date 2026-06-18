export type AgentRole = "SKEPTIC" | "STRATEGIST" | "OPERATOR";

export type AssumptionStatus = "VALIDATED" | "UNVALIDATED" | "NEEDS_INFO";

export type Remediation = {
  action: "VALIDATE" | "MODIFY" | "REMOVE";
  howTested: string;
  whatFound: string;
  resolvedAt: string;
};

export type AssumptionNode = {
  id: string;
  claim: string;
  status: AssumptionStatus;
  agentSource: AgentRole;
  explanation: string;
  howToTest?: string;
  remediation: Remediation | null;
};

export type QA = {
  question: string;
  answer: string;
};

export type DebateMessage = {
  agent: AgentRole;
  round: 1 | 2 | 3;
  content: string;
};

export type Canvas = {
  ideaSummary: string;
  questionnaireResponses: QA[];
  assumptions: AssumptionNode[];
  lastUpdated: string;
};
