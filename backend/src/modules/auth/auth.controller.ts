import { ServerResponse } from "@/common/constants";
import { ZodValidateError } from "@/common/errors/zod-validate-error";
import { ZodError } from "zod";
import { AuthService } from "./auth.service";
import { LoginDTO, LoginSchema } from "./dtos/auth.dto";

export interface IAuthController {
  login(body: LoginSchema): Promise<ServerResponse<any> | ZodValidateError>;
  logout(userId: string): Promise<ServerResponse<boolean>>;
}

class AuthController implements IAuthController {
  private readonly authService: AuthService;
  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  async login(
    body: LoginSchema,
  ): Promise<ServerResponse<any> | ZodValidateError> {
    try {
      const validatedFields = LoginDTO.parse(body);
      if (!validatedFields) throw new Error(validatedFields);

      const result = await this.authService.login(validatedFields);
      return new ServerResponse(200, "Successfully login", result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return new ZodValidateError(error);
      }
      return new ServerResponse(500, error.message);
    }
  }

  async logout(userId: string): Promise<ServerResponse<boolean>> {
    try {
      const result = await this.authService.logout(userId);
      return new ServerResponse(200, "Successfully logout", result);
    } catch (error: any) {
      return new ServerResponse(500, error.message);
    }
  }
}

export { AuthController };
