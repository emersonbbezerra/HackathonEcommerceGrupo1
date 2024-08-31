import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { ZodError } from "zod";
import { AuthController, IAuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDTO, LoginSchema } from "./dtos/auth.dto";

jest.mock("./auth.service");

let authController: IAuthController;
let authServiceMock: jest.Mocked<AuthService>;

describe("AuthController", () => {
  beforeEach(() => {
    authServiceMock = new AuthService(prismaMock) as jest.Mocked<AuthService>;
    authController = new AuthController(authServiceMock);
  });

  describe("Login", () => {
    const httpRequest: LoginSchema = {
      email: "valid@email.com",
      password: "valid_password",
    };
    it("Should return ZodValidateError", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(LoginDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await authController.login({
        ...httpRequest,
        email: "",
      });

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
    });

    it("Should success login user", async () => {
      authServiceMock.login.mockResolvedValueOnce({ accessToken: "token" });

      const resp = await authController.login(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully login", {
          accessToken: "token",
        }),
      );
    });
  });

  describe("Logout user", () => {
    it("Should log out the user successfully", async () => {
      jest.spyOn(authServiceMock, "logout").mockResolvedValue(true);

      const result = await authController.logout(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
      );
      expect(result).toEqual(
        new ServerResponse(200, "Successfully logout", true),
      );
    });

    it("Should return an error if logout fails", async () => {
      const errorMessage = "Logout failed";
      jest
        .spyOn(authServiceMock, "logout")
        .mockRejectedValue(new Error(errorMessage));

      const result = await authController.logout(
        "d426bcf6-8536-41f3-91ba-c39c581554e2",
      );
      expect(result).toEqual(new ServerResponse(500, errorMessage));
    });
  });
});
