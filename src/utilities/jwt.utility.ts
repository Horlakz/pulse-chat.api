import { sign, verify } from "jsonwebtoken";

import { config } from "@/config/env";

export type TokenType = "access" | "refresh";

export class JwtUtils {
  private static getSecretAndExpiry(secretType: TokenType): {
    secret: string;
    expiresIn: `${number}${"m" | "d"}`;
  } {
    switch (secretType) {
      case "access":
        return { secret: config.jwt.accessSecret, expiresIn: "15m" };
      case "refresh":
        return { secret: config.jwt.refreshSecret, expiresIn: "7d" };
      default:
        throw new Error(`Invalid token type: ${secretType}`);
    }
  }

  public static generate(sub: string, secretType: TokenType): string {
    const { secret, expiresIn } = this.getSecretAndExpiry(secretType);
    return sign({ sub }, secret, { expiresIn });
  }

  public static verify(token: string, secretType: TokenType) {
    const { secret } = this.getSecretAndExpiry(secretType);
    return verify(token, secret) as { sub: string };
  }
}
