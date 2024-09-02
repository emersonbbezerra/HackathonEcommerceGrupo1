import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { ZodError } from "zod";
import {
  CreateUserDTO,
  CreateUserType,
  UpdateUserDTO,
  UpdateUserType,
} from "./dtos/user.dto";
import { UserSchema } from "./entities/user";
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

  describe("findAll users", () => {
    it("Should successfully find all users", async () => {
      const usersData: UserSchema[] = [
        {
          id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
          first_name: "any_fname",
          last_name: "any_lname",
          email: "any@email.com",
          image: null,
          password: "hash",
          phone: "123456789",
          role: "USER",
          createdAt: new Date("2024-08-30T19:30:57.510Z"),
          updatedAt: new Date("2024-08-30T19:30:57.510Z"),
        },
        {
          id: "d426bcf6-8536-41f3-91ba-c39c345678w1",
          first_name: "other_fname",
          last_name: "other_lname",
          email: "other@email.com",
          image: null,
          password: "hash",
          phone: "987654321",
          role: "USER",
          createdAt: new Date("2024-08-28T19:30:57.510Z"),
          updatedAt: new Date("2024-08-28T19:30:57.510Z"),
        },
      ];
      usersServiceMock.findAll.mockResolvedValueOnce(usersData);

      const resp = await userController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully find all user", usersData),
      );
    });

    it("Should return ServerResponse with error when findAll fails", async () => {
      const errorMessage = "Failed to find users";
      usersServiceMock.findAll.mockRejectedValueOnce(new Error(errorMessage));

      const resp = await userController.findAll();

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Create user", () => {
    const httpRequest: CreateUserType = {
      first_name: "any_fname",
      last_name: "any_lname",
      email: "any@email.com",
      phone: "123456789",
      password: "any_password",
      confirmPassword: "any_password",
    };

    it("Should return ZodValidateError", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(CreateUserDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await userController.create({
        ...httpRequest,
        first_name: "",
      });

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
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

    it("Should return ServerResponse when user creation fails", async () => {
      usersServiceMock.create.mockRejectedValueOnce(
        new Error("Creation failed"),
      );

      const resp = await userController.create(httpRequest);

      expect(resp).toBeInstanceOf(ServerResponse);
    });
  });

  describe("findOne user", () => {
    it("Should successfully find one user", async () => {
      const usersData: UserSchema = {
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
        first_name: "any_fname",
        last_name: "any_lname",
        email: "any@email.com",
        image: null,
        password: "hash",
        phone: "123456789",
        role: "USER",
        createdAt: new Date("2024-08-30T19:30:57.510Z"),
        updatedAt: new Date("2024-08-30T19:30:57.510Z"),
      };
      usersServiceMock.getByUnique.mockResolvedValueOnce(usersData);

      const resp = await userController.findOne({
        id: "d426bcf6-8536-41f3-91ba-c39c581554e2",
      });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(200, "Successfully find user by id", usersData),
      );
    });

    it("Should return ServerResponse with error when findOne fail", async () => {
      const errorMessage = "Failed to find user";
      usersServiceMock.getByUnique.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const resp = await userController.findOne({});

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Update user", () => {
    const id = "user-id";
    const httpRequest: UpdateUserType = {
      first_name: "updated_fname",
      last_name: "updated_lname",
      email: "updated@email.com",
      phone: "987654321",
    };

    it("Should successfully update a user", async () => {
      usersServiceMock.update.mockResolvedValueOnce(true);

      const resp = await userController.update({ id, body: httpRequest });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(202, "Successfully update user", true),
      );
    });

    it("Should return ZodValidateError when validation fails", async () => {
      const zodError = new ZodError([]);
      jest.spyOn(UpdateUserDTO, "parse").mockImplementationOnce(() => {
        throw zodError;
      });

      const resp = await userController.update({
        id,
        body: {
          ...httpRequest,
          email: "",
        },
      });

      expect(resp).toBeInstanceOf(ZodValidateError);
      expect((resp as ZodValidateError).errors).toEqual(zodError.errors);
    });

    it("Should return ServerResponse with error when update fails", async () => {
      const errorMessage = "Update failed";
      usersServiceMock.update.mockRejectedValueOnce(new Error(errorMessage));

      const resp = await userController.update({ id, body: httpRequest });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });

  describe("Delete user", () => {
    const id = "user-id";

    it("Should successfully delete a user", async () => {
      usersServiceMock.delete.mockResolvedValueOnce(true);

      const resp = await userController.delete({
        id,
        body: { password: "any_password" },
      });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(
        new ServerResponse(202, "Successfully update user", true),
      );
    });

    it("Should return ServerResponse with error when delete fails", async () => {
      const errorMessage = "Deletion failed";
      usersServiceMock.delete.mockRejectedValueOnce(new Error(errorMessage));

      const resp = await userController.delete({
        id,
        body: { password: "any_password" },
      });

      expect(resp).toBeInstanceOf(ServerResponse);
      expect(resp).toEqual(new ServerResponse(500, errorMessage));
    });
  });
});
