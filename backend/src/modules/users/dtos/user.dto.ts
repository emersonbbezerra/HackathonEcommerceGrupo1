import { z } from "zod";
import { User } from "../entities/user";

const CreateUserDTO = User.pick({
  first_name: true,
  last_name: true,
  email: true,
  phone: true,
  password: true,
})
  .extend({ confirmPassword: z.string().min(5) })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword do not match password",
  });

const UpdateUserDTO = User.partial();

const UpdatePasswordUserDTO = z
  .object({
    oldPassword: z.string().min(5),
    newPassword: z.string().min(5),
    confirmNewPassword: z.string().min(5),
  })
  .refine(({ newPassword, confirmNewPassword }) => {
    if (newPassword !== confirmNewPassword)
      return { message: "password e confirmação devem ser iguais" };
  });

const DeleteUserDTO = User.pick({
  password: true,
});

export type CreateUserType = z.infer<typeof CreateUserDTO>;
export type UpdateUserType = z.infer<typeof UpdateUserDTO>;
export type UpdatePasswordUserType = z.infer<typeof UpdatePasswordUserDTO>;
export type DeleteUserType = z.infer<typeof DeleteUserDTO>;

export { CreateUserDTO, DeleteUserDTO, UpdatePasswordUserDTO, UpdateUserDTO };
