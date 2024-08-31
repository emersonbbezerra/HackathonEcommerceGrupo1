import { prismaMock } from "@/config/database/__mocks__/prisma";
import { CreateUserType } from "./dtos/user.dto";
import { UsersService } from "./users.service";

let userService: UsersService;

describe("UsersService", () => {
  const httpRequest: CreateUserType = {
    first_name: "any_fname",
    last_name: "any_lname",
    email: "any@email.com",
    phone: 123456789,
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
        phone: 123456789,
        role: "USER",
        createdAt: new Date("2024-08-30T19:30:57.510Z"),
        updatedAt: new Date("2024-08-30T19:30:57.510Z"),
      });

      await expect(userService.create(httpRequest)).rejects.toThrow(
        "User already exist.",
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
        phone: 123456789,
        role: "USER",
        createdAt: new Date("2024-08-30T19:30:57.510Z"),
        updatedAt: new Date("2024-08-30T19:30:57.510Z"),
      });

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
        phone: 123456789,
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
        phone: 123456789,
        role: "USER",
        createdAt: new Date("2024-08-30T19:30:57.510Z"),
        updatedAt: new Date("2024-08-30T19:30:57.510Z"),
      });
    });
  });
});
