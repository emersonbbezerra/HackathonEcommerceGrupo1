import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { CreateUserType } from "./dtos/user.dto";
import { IUserController, UserController } from "./users.controller";

let userController: IUserController;
describe("UserSController", () => {
  beforeEach(() => {
    userController = new UserController();
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

    it("Should be return zodError", async () => {
      const resp = await userController.create({
        ...httpRequest,
        first_name: "",
      });
      expect(resp).toBeInstanceOf(ZodValidateError);
      expect(resp.errors).toEqual([
        {
          code: "too_small",
          message: "String must contain at least 1 character(s)",
          path: "first_name",
        },
      ]);
    });

    it("Should be successfully create user", async () => {
      const resp = await userController.create(httpRequest);
      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(201, "Successfully create user", {
          accessToken: "token",
        }),
      );
    });
  });
});
