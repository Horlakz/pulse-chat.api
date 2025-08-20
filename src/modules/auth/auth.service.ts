import { PrismaService } from "@/config/prisma";
import { BadRequestException, NotFoundException } from "@/exceptions";
import { HashUtils } from "@/utilities/hash.utility";
import { JwtUtils } from "@/utilities/jwt.utility";
import { ILogin, IRegister } from "./auth.interface";

export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async login(data: ILogin) {
    const user = await this.db.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new NotFoundException("Invalid Credentials");

    const comparePassword = await HashUtils.compareHash(
      data.password,
      user.password
    );

    if (!comparePassword) throw new BadRequestException("Invalid credentials");

    return this.generateTokens(user.id);
  }

  async register(data: IRegister) {
    const user = await this.db.user.findUnique({
      where: { email: data.email },
    });
    if (user) throw new BadRequestException("User already exists");

    const newUser = await this.db.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: await HashUtils.hash(data.password),
      },
    });
  }

  refreshToken(refreshToken: string) {
    const payload = JwtUtils.verify(refreshToken, "refresh");
    return this.generateTokens(payload.sub as string);
  }

  private generateTokens(sub: string) {
    const accessToken = JwtUtils.generate(sub, "access");
    const refreshToken = JwtUtils.generate(sub, "refresh");

    return { accessToken, refreshToken };
  }
}
