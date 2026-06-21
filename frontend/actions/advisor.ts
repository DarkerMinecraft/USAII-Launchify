"use server";

import { GeminiError } from "@/lib/gemini";
import { callGeminiChat } from "@/lib/gemini";
import { buildAdvisorSystemPrompt } from "@/prompts/advisor";
import { forwardToBackend, ensureUserSynced, BackendAuthError, BackendError } from "@/lib/backend";
import type { SessionData, AdvisorData } from "@/lib/types";

class ActionAuthError extends Error {}
class ActionError extends Error {}

const handleBackendError = (err: unknown): never => {
  if (err instanceof BackendAuthError) throw new ActionAuthError("You must sign in first");
  if (err instanceof BackendError) throw new ActionError(err.message);
  throw new ActionError("Could not reach the backend");
};

export const getAdvisorData = async (sessionId: string): Promise<AdvisorData> => {
  try {
    await ensureUserSynced();
    return await forwardToBackend<AdvisorData>(`/v1/sessions/${sessionId}/advisor`);
  } catch (err) {
    if (err instanceof ActionAuthError || err instanceof ActionError) throw err;
    return handleBackendError(err);
  }
};

export const sendAdvisorMessage = async (
  sessionId: string,
  content: string,
): Promise<{ content: string }> => {
  try {
    await ensureUserSynced();

    const [advisorData, session] = await Promise.all([
      forwardToBackend<AdvisorData>(`/v1/sessions/${sessionId}/advisor`),
      forwardToBackend<SessionData>(`/v1/sessions/${sessionId}`),
    ]);

    const history = advisorData.messages.map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("model" as const),
      text: m.content,
    }));

    const systemPrompt = buildAdvisorSystemPrompt(session);
    const reply = await callGeminiChat(systemPrompt, history, content);

    await forwardToBackend(`/v1/sessions/${sessionId}/advisor/messages`, {
      method: "POST",
      data: [
        { role: "USER", content },
        { role: "ASSISTANT", content: reply },
      ],
    });

    return { content: reply };
  } catch (err) {
    if (err instanceof ActionAuthError || err instanceof ActionError) throw err;
    if (err instanceof GeminiError) throw new ActionError("AI advisor is temporarily unavailable");
    return handleBackendError(err);
  }
};
