import { z } from "zod";

const roleUser = {
  USER: "USER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
};

const User = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  image: z.string().url().nullable(),
  phone: z.number(),
  password: z.string().min(5),
  role: z.nativeEnum(roleUser),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSchema = z.infer<typeof User>;

export { User };
