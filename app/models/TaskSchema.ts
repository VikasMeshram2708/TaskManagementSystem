import * as z from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(250, { message: "Title cannot exceed 50 characters." }),

  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long." })
    .max(350, { message: "Description cannot exceed 50 characters." }),

  status: z
    .enum(["todo", "inProgress", "done"], {
      required_error: "Status is required.",
      invalid_type_error: "Invalid status selected.",
    })
    .optional(),
});
export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(50, { message: "Title cannot exceed 50 characters." })
    .optional(),

  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long." })
    .max(50, { message: "Description cannot exceed 50 characters." })
    .optional(),

  status: z
    .enum(["todo", "inProgress", "done"], {
      required_error: "Status is required.",
      invalid_type_error: "Invalid status selected.",
    })
    .optional(),
});
export type UpdateTaskSchema = z.infer<typeof UpdateTaskSchema>;
