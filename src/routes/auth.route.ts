import { Router } from "express";

import { PrismaService } from "@/config/prisma";
import { validateDto } from "@/middleware/validator-dto";
import { AuthController } from "@/modules/auth/auth.controller";
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from "@/modules/auth/auth.dto";
import { AuthService } from "@/modules/auth/auth.service";

export default function initAuthRouter(db: PrismaService) {
  const authService = new AuthService(db);
  const authController = new AuthController(authService);
  const authRouter = Router();

  authRouter.post("/login", validateDto(LoginDto), authController.login);
  authRouter.post(
    "/register",
    validateDto(RegisterDto),
    authController.register
  );
  authRouter.post(
    "/refresh-token",
    validateDto(RefreshTokenDto),
    authController.refreshToken
  );

  return authRouter;
}
