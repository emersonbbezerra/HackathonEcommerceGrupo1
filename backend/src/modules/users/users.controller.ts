import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import { CreateUserDTO, CreateUserType } from "./dtos/user.dto";
import { UserSchema } from "./entities/user";
import { UsersService } from "./users.service";

export interface IUserController {
  create(body: CreateUserType): Promise<ServerResponse<any> | ZodValidateError>;
  findAll(): Promise<ServerResponse<UserSchema[] | null>>;
  findOne(params): Promise<ServerResponse<UserSchema | null>>;
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
      return new ServerResponse(400, error.message);
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
      return new ServerResponse(400, error.message);
    }
  }

  async findOne(params): Promise<ServerResponse<UserSchema | null>> {
    try {
      const result = await this.usersService.getByUnique(params);
      return new ServerResponse(200, "Successfully find user by id", result);
    } catch (error: any) {
      return new ServerResponse(400, error.message);
    }
  }
}

export { UserController };
