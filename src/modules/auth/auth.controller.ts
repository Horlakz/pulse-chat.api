import type { Request, Response } from "express";

import { BaseResponse } from "@/utilities/base-reponse";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const token = await this.authService.login(req.body);

    res.json(BaseResponse.success(token));
  };

  register = async (req: Request, res: Response) => {
    await this.authService.register(req.body);

    res.json(BaseResponse.success());
  };

  refreshToken = async (req: Request, res: Response) => {
    const token = this.authService.refreshToken(req.body.token);

    res.json(BaseResponse.success(token));
  };
}
