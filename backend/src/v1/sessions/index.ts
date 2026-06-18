import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireUser } from "../../middleware/requireUser";
import { AgentRole, NodeStatus, SessionStatus } from "../../generated/prisma/client";

const router = Router();

// POST /v1/sessions — create a new War Room session after questionnaire
router.post("/", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { ideaSummary, questionnaireResponses } = req.body;

  if (!ideaSummary || !questionnaireResponses) {
    return res.status(400).json({ error: "ideaSummary and questionnaireResponses are required" });
  }

  const session = await prisma.warRoomSession.create({
    data: {
      userId: user.id,
      ideaSummary,
      questionnaireResponses,
    },
    select: { id: true, ideaSummary: true, status: true, createdAt: true },
  });

  return res.status(201).json(session);
});

// GET /v1/sessions/:id — fetch session with full transcript and assumptions
router.get("/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { id } = req.params;

  const session = await prisma.warRoomSession.findUnique({
    where: { id },
    include: {
      transcript: { orderBy: { createdAt: "asc" } },
      assumptions: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!session) return res.status(404).json({ error: "Session not found" });
  if (session.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

  return res.json(session);
});

// PATCH /v1/sessions/:id — persist canvas, status, debate messages, and/or assumptions
router.patch("/:id", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  const { id } = req.params;
  const { canvas, status, messages, assumptions } = req.body as {
    canvas?: object;
    status?: SessionStatus;
    messages?: { agent: AgentRole; round: number; content: string }[];
    assumptions?: {
      claim: string;
      status: NodeStatus;
      explanation: string;
      agentSource: AgentRole;
      remediation?: object;
    }[];
  };

  const session = await prisma.warRoomSession.findUnique({ where: { id } });
  if (!session) return res.status(404).json({ error: "Session not found" });
  if (session.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

  await prisma.$transaction(async (tx) => {
    await tx.warRoomSession.update({
      where: { id },
      data: {
        ...(canvas !== undefined && { canvas }),
        ...(status !== undefined && { status }),
      },
    });

    if (messages?.length) {
      await tx.debateMessage.createMany({
        data: messages.map((m) => ({ ...m, sessionId: id })),
      });
    }

    if (assumptions?.length) {
      await tx.assumptionNode.createMany({
        data: assumptions.map((a) => ({ ...a, sessionId: id })),
      });
    }
  });

  const updated = await prisma.warRoomSession.findUnique({
    where: { id },
    include: {
      transcript: { orderBy: { createdAt: "asc" } },
      assumptions: { orderBy: { createdAt: "asc" } },
    },
  });

  return res.json(updated);
});

export default router;
