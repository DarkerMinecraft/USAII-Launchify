"use client";

// Stub — replaced in Task 6
export const AdvisorClient = (_props: {
  sessionId: string;
  ideaSummary: string;
  initialMessages: { id: string; role: "USER" | "ASSISTANT"; content: string; createdAt: string }[];
  initialDocuments: { id: string; filename: string; uploadedAt: string; chunkCount: number }[];
}) => (
  <div className="flex items-center justify-center h-full text-text-faint text-[13px]">
    Loading Strategy Room…
  </div>
);
