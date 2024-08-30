import { ZodError } from "zod";

export class ZodValidateError {
  errors: Array<{ code: string; message: string; path: string }>;

  constructor(error: ZodError) {
    this.errors = error.issues.map(({ code, message, path }) => ({
      code,
      message,
      path: path.join("."),
    }));
  }
}
