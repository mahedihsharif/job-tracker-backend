import * as z from "zod";

export const userRegisterValidation = z.object({
  name: z
    .string()
    .min(2, { message: "name Must be 2 character long." })
    .max(30, { message: "name must be maximum 30 characters." }),
  email: z.email({ message: "Invalid email address format." }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters long." }),
});

export const userLoginValidation = z.object({
  email: z.email({ message: "Invalid email address format." }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters long." }),
});

export const userResetPasswordValidation = z.object({
  newPassword: z
    .string()
    .min(6, { message: "new password must be at least 6 characters long." }),
});
