import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { CreateUserType } from "./dtos/user.dto";
import { IUserController, UserController } from "./users.controller";
import { UsersService } from "./users.service";

jest.mock("./users.service");

let userController: IUserController;
let usersServiceMock: jest.Mocked<UsersService>;

describe("UserController", () => {
  beforeEach(() => {
    usersServiceMock = new UsersService(
      prismaMock,
    ) as jest.Mocked<UsersService>;
    userController = new UserController(usersServiceMock);
  });

  describe("Create user", () => {
    const httpRequest: CreateUserType = {
      first_name: "any_fname",
      last_name: "any_lname",
      email: "any@email.com",
      phone: 123456789,
      password: "any_password",
      confirmPassword: "any_password",
    };

    it("Should return ZodValidateError", async () => {
      const resp = await userController.create({
        ...httpRequest,
        first_name: "",
      });
      expect(resp).toBeInstanceOf(ZodValidateError);
    });

    it("Should successfully create a user", async () => {
      const tokenData = { accessToken: "token" };
      usersServiceMock.create.mockResolvedValueOnce(tokenData);

      const resp = await userController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(201, "Successfully create user", tokenData),
      );
    });

    it("Should return ServerError when user creation fails", async () => {
      usersServiceMock.create.mockRejectedValueOnce(
        new Error("Creation failed"),
      );

      const resp = await userController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
    });
  });
});
