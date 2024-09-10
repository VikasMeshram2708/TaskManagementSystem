import { UpdateTaskSchema } from "@/app/models/Task";
import { ConnectDB } from "@/helpers/DB";
import ErrorHandler from "@/helpers/ErrorHandler";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    // Parse and validate the request body
    const reqBody = await request.json();

    const task = UpdateTaskSchema.parse(reqBody);

    // Connect to the database
    await ConnectDB();

    // Create a new task in the database
    await prismaInstance.task.update({
      where: {
        id: task.taskId,
      },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Task UpdatedI" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an appropriate response
    return ErrorHandler(request, error);
  }
};
