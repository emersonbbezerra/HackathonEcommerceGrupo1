import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import {
  CreateUserType,
  DeleteUserType,
  UpdateUserType,
} from "./dtos/user.dto";
import { UsersService } from "./users.service";

let userService: UsersService;

describe("UserService", () => {
  const httpRequest: CreateUserType = {
    first_name: "any_fname",
    last_name: "any_lname",
    email: "any@email.com",
    phone: "123456789",
    password: "any_password",
    confirmPassword: "any_password",
  };

  beforeEach(() => {
    userService = new UsersService(prismaMock);
  });

  describe("Create user", () => {
    it("Should throw an error if user already exists", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
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
      });

      await expect(userService.create(httpRequest)).rejects.toThrow(
        "User already exist.",
      );
    });

    it("Should throw an error if passwords do not match", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(
        userService.create({
          ...httpRequest,
          password: "password1",
          confirmPassword: "password2",
        }),
      ).rejects.toThrow(ServerError);
    });

    it("Should throw an error if login fails", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
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
      });

      jest
        .spyOn(AuthService.prototype, "login")
        .mockResolvedValue(new ServerError("Login error"));

      await expect(userService.create(httpRequest)).rejects.toThrow(
        "Login error",
      );
    });

    it("Should create a new user successfully", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
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
      });

      jest
        .spyOn(AuthService.prototype, "login")
        .mockResolvedValue({ accessToken: "token" });

      const result = await userService.create(httpRequest);
      expect(result).toEqual({ accessToken: "token" });
    });
  });

  describe("Check If User Exist", () => {
    it("Should return null if user does not exist", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userService.getByUnique({
        field: "email",
        value: httpRequest.email,
      });

      expect(result).toBeNull();
    });

    it("Should return user if user exists", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
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
      });

      const result = await userService.getByUnique({
        field: "email",
        value: httpRequest.email,
      });
      expect(result).toEqual({
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
      });
    });
  });

  describe("Update user", () => {
    const id = "user-id";
    const updateData: UpdateUserType = {
      first_name: "updated_fame",
      last_name: "updated_lname",
      email: "updated@example.com",
      phone: "123456789",
      password: "new_password",
    };

    it("Should throw an error if user does not exist", async () => {
      jest.spyOn(userService, "getByUnique").mockResolvedValue(null);

      await expect(
        userService.update({ id, data: updateData }),
      ).rejects.toThrow("User not exist.");
    });

    it("Should return ServerError if update fails", async () => {
      jest.spyOn(userService, "getByUnique").mockResolvedValue({
        id,
        first_name: "existing_fname",
        last_name: "existing_lname",
        email: "existing@example.com",
        image: null,
        phone: "987654321",
        role: "USER",
        password: "existing_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(userService.prisma.user, "update").mockResolvedValue(null);

      await expect(
        userService.update({ id, data: updateData }),
      ).rejects.toThrow("Update failed");
    });

    it("Should update a user successfully", async () => {
      jest.spyOn(userService, "getByUnique").mockResolvedValue({
        id,
        first_name: "existing_fname",
        last_name: "existing_lname",
        email: "existing@example.com",
        image: null,
        phone: "987654321",
        role: "USER",
        password: "existing_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(userService.prisma.user, "update").mockResolvedValue({
        id,
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        email: updateData.email,
        phone: updateData.phone,
        password: updateData.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.update({ id, data: updateData });

      expect(result).toBe(true);
    });
  });

  describe("Delete user", () => {
    const userId = "d426bcf6-8536-41f3-91ba-c39c581554e2";
    const deleteRequest: DeleteUserType = {
      password: "correct_password",
    };
    it("Should throw an error if user does not exist", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(
        userService.delete({ id: userId, body: deleteRequest }),
      ).rejects.toThrow("User not exist.");
    });

    it("Should throw an error if password does not match", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: userId,
        password: "hashed_password",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(
        userService.delete({ id: userId, body: deleteRequest }),
      ).rejects.toThrow("Password not match.");
    });

    it("Should throw an error if deletion fails", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: userId,
        password: "hashed_password",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      prismaMock.user.delete.mockResolvedValue(null);

      await expect(
        userService.delete({ id: userId, body: deleteRequest }),
      ).rejects.toThrow(ServerError);
    });

    it("Should delete the user successfully", async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: userId,
        password: "hashed_password",
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      prismaMock.user.delete.mockResolvedValue({
        id: userId,
        first_name: "any_fname",
        last_name: "any_lname",
        email: "any@email.com",
        image: null,
        password: "hashed_password",
        phone: "123456789",
        role: "USER",
        createdAt: new Date("2024-08-30T19:30:57.510Z"),
        updatedAt: new Date("2024-08-30T19:30:57.510Z"),
      });

      const result = await userService.delete({
        id: userId,
        body: deleteRequest,
      });

      expect(result).toBe(true);
    });
  });
});
