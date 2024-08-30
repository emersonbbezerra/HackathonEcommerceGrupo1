import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  phone: z.number().optional(),
  password: z.string().min(5),
  created_at: z.string().date(),
  updated_at: z.string().date(),
});
