import { deleteTaskSchema } from "app/models/Task";
import ErrorHandler from "helpers/ErrorHandler";
import { prismaInstance } from "helpers/PrismaInstance";
import { NextResponse } from "next/server";

export const DELETE = async (request) => {
  try {
    const reqBody = await request.json();

    const task = deleteTaskSchema.parse(reqBody);
    // find the task

    const taskExist = await prismaInstance.task.findFirst({
      where: {
        id: task.taskId,
      },
    });

    if (!taskExist) {
      return NextResponse.json(
        {
          message: "Task Doesn't Exist",
        },
        {
          status: 422,
        }
      );
    }

    await prismaInstance.task.delete({
      where: {
        id: task.taskId,
      },
    });

    return NextResponse.json(
      {
        message: "Task Deleted",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
