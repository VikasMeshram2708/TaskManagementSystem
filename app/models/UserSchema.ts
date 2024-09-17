import * as z from "zod";

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long." })
    .max(20, { message: "Password cannot exceed 20 characters." }),
});

export type loginUserSchema = z.infer<typeof loginUserSchema>;

export const signupUserSchema = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" })
      .max(20, { message: "First name must not exceed 20 characters" }),

    lastname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" })
      .max(20, { message: "Last name must not exceed 20 characters" }),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .refine((email) => email.toLowerCase().endsWith(".com"), {
        message: "Only .com email addresses are allowed",
      }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(50, { message: "Password must not exceed 50 characters" }),
    cPassword: z
      .string()
      .min(5, {
        message: "Confirm password must be at least 5 characters long",
      })
      .max(50, { message: "Confirm password must not exceed 50 characters" }),
  })
  .refine((data) => data.password === data.cPassword, {
    path: ["cPassword"],
    message: "Passwords do not match",
  });

export type signupUserSchema = z.infer<typeof signupUserSchema>;

export const clientUserSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(20, { message: "First name must not exceed 20 characters" }),

  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(20, { message: "Last name must not exceed 20 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine((email) => email.toLowerCase().endsWith(".com"), {
      message: "Only .com email addresses are allowed",
    }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(50, { message: "Password must not exceed 50 characters" }),
});

export type clientUserSchema = z.infer<typeof clientUserSchema>;
