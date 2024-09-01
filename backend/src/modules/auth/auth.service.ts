import { jwtConstants } from "@/common/constants/jwt-constants";
import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { Prisma } from "@/config/database/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../users/entities/user";
import { LoginSchema } from "./dtos/auth.dto";

export interface IAuthService {
  login(data: LoginSchema): Promise<{ accessToken: string } | ServerError>;
  logout(id: string): Promise<boolean>;
  jwtSessionToken(userId: string): Promise<{ accessToken: string }>;
  generateToken(payload: any): Promise<string>;
}

class AuthService implements IAuthService {
  prisma: Prisma | typeof prismaMock;
  constructor(prisma?: typeof prismaMock) {
    this.prisma = prisma || new Prisma();
  }

  async login(
    data: LoginSchema,
  ): Promise<{ accessToken: string } | ServerError> {
    const user = await this.findUserByEmail(data.email);

    if (!user || !(await this.verifyPassword(data.password, user.password))) {
      return new ServerError("Invalid email or password");
    }

    return this.jwtSessionToken(user.id);
  }

  async logout(id: string): Promise<boolean> {
    await this.prisma.session.updateMany({
      where: {
        user: { id },
        active: true,
      },
      data: {
        token: null,
        active: false,
      },
    });

    return true;
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
  }

  private async verifyPassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async jwtSessionToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.findUserWithSessions(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await this.deactivateActiveSessions(userId);
    const session = await this.createSession(userId);
    const accessToken = await this.generateToken({
      userId,
      sessionId: session.id,
      type: "access",
    });

    return {
      accessToken: await this.updateSessionToken(session.id, accessToken),
    };
  }

  private async findUserWithSessions(
    userId: string,
  ): Promise<UserSchema | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });
  }

  private async deactivateActiveSessions(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId, active: true },
      data: { token: null, active: false },
    });
  }

  private async createSession(userId: string) {
    return this.prisma.session.create({
      data: {
        userId,
        token: null,
        active: true,
      },
    });
  }

  private async updateSessionToken(sessionId: string, token: string) {
    const session = await this.prisma.session.update({
      where: { id: sessionId },
      data: { token },
    });

    return session.token;
  }

  async generateToken(payload: any): Promise<string> {
    const { secret, expiresToken } = jwtConstants;
    return jwt.sign(payload, secret, { expiresIn: expiresToken });
  }
}

export { AuthService };
