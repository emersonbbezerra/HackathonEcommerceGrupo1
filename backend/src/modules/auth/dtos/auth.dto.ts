import { User } from "@/modules/users/entities/user";
import { z } from "zod";

const LoginDTO = User.pick({
  email: true,
  password: true,
});

export type LoginSchema = z.infer<typeof LoginDTO>;

export { LoginDTO };
