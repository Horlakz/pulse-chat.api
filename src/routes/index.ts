import { Router } from "express";

import { PrismaService } from "@/config/prisma";
import { authGuard } from "@/middleware/auth";
import initAuthRouter from "./auth.route";
import initChatRouter from "./chat.route";

const db = new PrismaService();
const router = Router();

router.get("/health", (_, res) => res.json({ status: "ok" }));

router.use("/auth", initAuthRouter(db));
router.use("/chat", authGuard, initChatRouter(db));

export default router;
