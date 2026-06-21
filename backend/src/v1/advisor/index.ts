import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireUser } from "../../middleware/require-user";

// mergeParams so req.params.id (session id) is accessible from parent router
const router = Router({ mergeParams: true });

const MessageSchema = z.object({
  role: z.enum(["USER", "ASSISTANT"]),
  content: z.string().min(1),
});

// GET /v1/sessions/:id/advisor
router.get("/", async (req: Request<{ id: string }>, res: Response) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const session = await prisma.warRoomSession.findFirst({
      where: { id: req.params.id, userId: user.id },
      select: { id: true },
    });
    if (!session) return res.status(404).json({ error: "session_not_found" });

    const messages = await prisma.advisorMessage.findMany({
      where: { sessionId: req.params.id },
      orderBy: { createdAt: "asc" },
    });

    return res.json({ messages, documents: [] });
  } catch (err) {
    console.error("[advisor GET]", err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "internal_server_error" });
  }
});

// POST /v1/sessions/:id/advisor/messages
router.post("/messages", async (req: Request<{ id: string }>, res: Response) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const session = await prisma.warRoomSession.findFirst({
      where: { id: req.params.id, userId: user.id },
      select: { id: true },
    });
    if (!session) return res.status(404).json({ error: "session_not_found" });

    const parsed = z.array(MessageSchema).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten().fieldErrors });
    }

    await prisma.advisorMessage.createMany({
      data: parsed.data.map((m) => ({ sessionId: req.params.id, role: m.role, content: m.content })),
    });

    return res.status(201).json({ saved: parsed.data.length });
  } catch (err) {
    console.error("[advisor POST messages]", err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "internal_server_error" });
  }
});

export default router;
