import * as z from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(50, { message: "Title cannot exceed 50 characters" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long" })
    .max(100, { message: "Description cannot exceed 100 characters" }),
  status: z
    .string()
    .min(2, { message: "Status must be at least 2 characters long" })
    .max(50, { message: "Status cannot exceed 50 characters" })
    .optional(),
  uEmail: z.string().email(),
});
