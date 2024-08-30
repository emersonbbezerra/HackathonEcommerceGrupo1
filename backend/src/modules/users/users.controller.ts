import { ServerResponse } from "@/common/constants";
import { ServerError } from "@/common/errors/server-error";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import { CreateUserDTO, CreateUserType } from "./dtos/user.dto";

export interface IUserController {
  create(body: CreateUserType);
}

class UserController implements IUserController {
  async create(body: CreateUserType) {
    try {
      const validatedFields = CreateUserDTO.parse(body);
      if (!validatedFields) throw new Error(validatedFields);

      // TODO: add connection with usersService
      const resp = { accessToken: "token" };
      return new ServerResponse(201, "Successfully create user", resp);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerError();
    }
  }
}

export { UserController };
