import * as z from "zod";

export const CreateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(20, { message: "Name must be at most 20 characters long." })
      .nonempty({ message: "Name is required." }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .nonempty({ message: "Email is required." }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long." })
      .max(20, { message: "Password must be at most 20 characters long." })
      .nonempty({ message: "Password is required." }),
    cPassword: z
      .string()
      .min(5, {
        message: "Confirm Password must be at least 5 characters long.",
      })
      .max(20, {
        message: "Confirm Password must be at most 20 characters long.",
      })
      .nonempty({ message: "Confirm Password is required." }),
  })
  .refine((data) => data.password === data.cPassword, {
    path: ["cPassword"],
    message: "Confirm Password didn't match the password.",
  });

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;

export const UserSchemaLogin = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .nonempty({ message: "Email is required." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long." })
    .max(20, { message: "Password must be at most 20 characters long." })
    .nonempty({ message: "Password is required." }),
});

export type UserSchemaLogin = z.infer<typeof UserSchemaLogin>;
