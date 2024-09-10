import * as z from "zod";

export const UserSchema = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" })
      .max(50, { message: "First name must be less than 50 characters" }),
    lastname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" })
      .max(50, { message: "Last name must be less than 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(70, { message: "Password must be less than 70 characters" }),
    cPassword: z
      .string()
      .min(5, {
        message: "Confirm password must be at least 5 characters long",
      })
      .max(70, { message: "Confirm password must be less than 70 characters" }),
  })
  .refine((data) => data.password === data.cPassword, {
    path: ["cPassword"],
    message: "Passwords do not match",
  });

export const CreateUserSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(70, { message: "Password must be less than 70 characters" }),
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(70, { message: "Password must be less than 70 characters" }),
});
