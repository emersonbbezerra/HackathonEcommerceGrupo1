import { ServerResponse } from "@/common/constants";
import { ServerError } from "@/common/errors/server-error";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import {
  CreateUserDTO,
  CreateUserType,
  UpdateUserDTO,
  UpdateUserType,
} from "./dtos/user.dto";
import { UserSchema } from "./entities/user";
import { UsersService } from "./users.service";

export interface IUserController {
  create(body: CreateUserType): Promise<ServerResponse<any> | ZodValidateError>;
  findAll(): Promise<ServerResponse<UserSchema[] | null>>;
  findOne(params): Promise<ServerResponse<UserSchema | null>>;
  update(
    id: string,
    body: UpdateUserType,
  ): Promise<ServerResponse<any> | ZodValidateError>;
  delete(id: string): Promise<ServerResponse<boolean | ServerError>>;
}

class UserController implements IUserController {
  private readonly usersService: UsersService;
  constructor(usersService?: UsersService) {
    this.usersService = usersService || new UsersService();
  }

  async findAll(): Promise<ServerResponse<UserSchema[] | null>> {
    try {
      const result = await this.usersService.findAll();
      return new ServerResponse(200, "Successfully find all user", result);
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }

  async create(
    body: CreateUserType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = CreateUserDTO.parse(body);
      if (!validatedFields) throw new Error(validatedFields);

      const result = await this.usersService.create(validatedFields);
      return new ServerResponse(201, "Successfully create user", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, error.message);
    }
  }

  async findOne(params): Promise<ServerResponse<UserSchema | null>> {
    try {
      const result = await this.usersService.getByUnique(params);
      return new ServerResponse(200, "Successfully find user by id", result);
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }

  async update(
    id: string,
    body: UpdateUserType,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const data = UpdateUserDTO.parse(body);
      if (!data) throw new Error(data);

      const result = await this.usersService.update({ id, data });
      return new ServerResponse(202, "Successfully update user", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, error.message);
    }
  }

  async delete(id: string): Promise<ServerResponse<boolean | ServerError>> {
    try {
      const result = await this.usersService.delete(id);
      return new ServerResponse(202, "Successfully update user", result);
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }
}

export { UserController };
