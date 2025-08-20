import { JwtUtils } from "@/utilities/jwt.utility";
import { NextFunction, Request, Response } from "express";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = header.slice(7);
  try {
    const payload = JwtUtils.verify(token, "access");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
