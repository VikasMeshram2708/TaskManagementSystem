import * as z from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(50, { message: "Title must be at most 50 characters long." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long." })
    .max(50, { message: "Description must be at most 50 characters long." }),
  status: z
    .enum(["todo", "inProgress", "done"], {
      message:
        "Status must be one of the following: 'todo', 'inProgress', or 'done'.",
    })
    .optional(),
});

export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;

export const DeleteTaskSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteTaskSchema = z.infer<typeof DeleteTaskSchema>;

export const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(50, { message: "Title must be at most 50 characters long." })
    .optional(),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long." })
    .max(50, { message: "Description must be at most 50 characters long." })
    .optional(),
  status: z
    .enum(["todo", "inProgress", "done"], {
      message:
        "Status must be one of the following: 'todo', 'inProgress', or 'done'.",
    })
    .optional(),
});

export type UpdateTaskSchema = z.infer<typeof UpdateTaskSchema>;
