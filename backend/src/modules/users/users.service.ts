import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { Prisma } from "@/config/database/prisma";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import {
  CreateUserType,
  DeleteUserType,
  UpdateUserType,
} from "./dtos/user.dto";
import { UserSchema } from "./entities/user";

export interface IUsersService {
  findAll(): Promise<UserSchema[]>;
  create(data: CreateUserType): Promise<{ accessToken: string }>;
  getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<UserSchema | null>;
  update({ id, data }: { id: string; data: UpdateUserType }): Promise<boolean>;
  delete({ id, body }: { id: string; body: DeleteUserType }): Promise<boolean>;
}

class UsersService implements IUsersService {
  prisma: Prisma | typeof prismaMock;
  constructor(prisma?: typeof prismaMock) {
    this.prisma = prisma || new Prisma();
  }

  async findAll(): Promise<UserSchema[]> {
    const result = await this.prisma.user.findMany({ take: 10 });
    return result;
  }

  async create(data: CreateUserType): Promise<{ accessToken: string }> {
    const userExist = await this.getByUnique({
      field: "email",
      value: data.email,
    });
    if (userExist) throw new ServerError("User already exist.");

    const { password, confirmPassword, ...rest } = data;

    if (password !== confirmPassword) throw new ServerError();

    const passwordHash = await bcrypt.hash(data.password, 12);

    const result = await this.prisma.user.create({
      data: {
        ...rest,
        password: passwordHash,
      },
    });
    if (!result) throw new ServerError();

    const login = await new AuthService().login({
      email: data.email,
      password: data.password,
    });

    if (login instanceof ServerError) throw new ServerError("Login error");

    return login;
  }

  async getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<UserSchema | null> {
    const user = await this.prisma.user.findFirst({
      where: { [field]: value },
    });

    if (!user) return null;

    return user;
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserType;
  }): Promise<boolean> {
    const user = await this.getByUnique({ field: "id", value: id });
    if (!user) throw new ServerError("User not exist.");

    const result = await this.prisma.user.update({
      where: { id: user.id },
      data: data,
    });
    if (!result) throw new ServerError("Update failed");

    return true;
  }

  async delete({
    id,
    body,
  }: {
    id: string;
    body: DeleteUserType;
  }): Promise<boolean> {
    const user = await this.getByUnique({ field: "id", value: id });
    if (!user) throw new ServerError("User not exist.");

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) throw new ServerError("Password not match.");

    const deleted = await this.prisma.user.delete({ where: { id } });
    if (!deleted) throw new ServerError("Password not match.");

    return deleted;
  }
}
export { UsersService };
