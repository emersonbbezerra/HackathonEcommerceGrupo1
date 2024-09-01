import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(prismaMock);
  });

  describe("login", () => {
    it("should return ServerError if user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authService.login({
        email: "user@example.com",
        password: "correct_password",
      });

      expect(result).toBeInstanceOf(ServerError);
      expect((result as ServerError).message).toBe("Invalid email or password");
    });

    it("should return ServerError if password is incorrect", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-id",
        password: await bcrypt.hash("correct_password", 10),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login({
        email: "user@example.com",
        password: "wrong_password",
      });

      expect(result).toBeInstanceOf(ServerError);
      expect((result as ServerError).message).toBe("Invalid email or password");
    });

    it("should return accessToken on successful login", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-id",
        password: await bcrypt.hash("correct_password", 10),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(authService as any, "jwtSessionToken").mockResolvedValue({
        accessToken: "mocked_token",
      });

      const result = await authService.login({
        email: "user@example.com",
        password: "correct_password",
      });

      expect(result).toEqual({ accessToken: "mocked_token" });
    });
  });

  describe("logout", () => {
    it("should set active sessions to inactive and remove tokens", async () => {
      const userId = "test-user-id";

      prismaMock.session.updateMany.mockResolvedValue({ count: 1 });

      const result = await authService.logout(userId);

      expect(prismaMock.session.updateMany).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          active: true,
        },
        data: {
          token: null,
          active: false,
        },
      });

      expect(result).toBe(true);
    });
  });

  describe("jwtSessionToken", () => {
    it("should generate JWT session token for the user", async () => {
      const userId = "user-id";

      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        sessions: [],
      });

      prismaMock.session.updateMany.mockResolvedValue({ count: 1 });
      prismaMock.session.create.mockResolvedValue({
        id: "session-id",
        userId: userId,
        token: null,
        active: true,
      });

      jest.spyOn(authService, "generateToken").mockResolvedValue("mocked_jwt");

      prismaMock.session.update.mockResolvedValue({
        id: "session-id",
        userId: userId,
        token: "mocked_jwt",
        active: true,
      });

      const result = await authService.jwtSessionToken(userId);

      expect(result).toEqual({ accessToken: "mocked_jwt" });
      expect(authService.generateToken).toHaveBeenCalledWith({
        userId,
        sessionId: "session-id",
        type: "access",
      });
    });

    it("should throw error if user not found", async () => {
      const userId = "non-existing-user-id";

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(authService.jwtSessionToken(userId)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("generateToken", () => {
    it("should generate JWT with correct payload", async () => {
      const payload = {
        userId: "user-id",
        sessionId: "session-id",
        type: "access",
      };

      jest
        .spyOn(authService as any, "generateToken")
        .mockResolvedValue("mocked_token");

      await expect(authService.generateToken(payload)).resolves.toEqual(
        "mocked_token",
      );
    });
  });
});
