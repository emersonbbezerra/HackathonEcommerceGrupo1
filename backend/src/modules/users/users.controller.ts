import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import { CreateUserDTO, CreateUserType } from "./dtos/user.dto";
import { UsersService } from "./users.service";

export interface IUserController {
  create(body: CreateUserType): Promise<ServerResponse<any> | ZodValidateError>;
}

class UserController implements IUserController {
  private readonly usersService: UsersService;
  constructor(usersService?: UsersService) {
    this.usersService = usersService || new UsersService();
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
}

export { UserController };
