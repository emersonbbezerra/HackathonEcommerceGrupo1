import { ServerError } from "@/common/errors/server-error";
import { prismaMock } from "@/config/database/__mocks__/prisma";
import { Prisma } from "@/config/database/prisma";
import { CreateUserType, UpdateUserType } from "./dtos/user.dto";
import { UserSchema } from "./entities/user";

export interface IUsersService {
  findAll(): Promise<UserSchema[]>;
  create(data: CreateUserType): Promise<{ accessToken: string } | ServerError>;
  getByUnique({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }): Promise<UserSchema | null>;
  update({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserType;
  }): Promise<boolean | ServerError>;
  delete(id: string): Promise<boolean | ServerError>;
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

  async create(
    data: CreateUserType,
  ): Promise<{ accessToken: string } | ServerError> {
    const [emailExist, phoneExist] = await Promise.all([
      this.getByUnique({ field: "email", value: data.email }),
      this.getByUnique({ field: "phone", value: data.phone }),
    ]);
    if (emailExist || phoneExist) throw new Error("User already exist.");

    const { first_name, last_name, email, phone, password, confirmPassword } =
      data;

    if (password !== confirmPassword) return new ServerError();

    const result = await this.prisma.user.create({
      data: { first_name, last_name, email, phone, password: "hash" },
    });

    if (!result) return new ServerError();

    return { accessToken: "token" };
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
  }): Promise<boolean | ServerError> {
    const user = await this.getByUnique({ field: "id", value: id });
    if (!user) return new ServerError("User not exist.");

    const result = await this.prisma.user.update({ where: { id }, data });
    if (!result) return new ServerError("Update failed");

    return true;
  }

  async delete(id: string): Promise<boolean | ServerError> {
    const user = await this.getByUnique({ field: "id", value: id });
    if (!user) return new ServerError("User not exist.");

    return true;
  }
}
export { UsersService };
