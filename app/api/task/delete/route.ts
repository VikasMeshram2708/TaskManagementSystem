import { deleteTaskSchema } from "@/app/models/TaskSchema";
import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  try {
    // const token = await GetDataFromToken(request);

    // Parse and validate the request body
    const reqBody = await request.json();

    const taskResult = deleteTaskSchema.safeParse(reqBody);

    if (!taskResult.success) {
      throw new Error("Invalid data");
    }

    const parsedTask = taskResult.data;

    // Connect to the database
    await ConnectDB();

    // Create a new task in the database
    await prismaInstance.task.delete({
      where: {
        id: String(parsedTask?.id),
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Task Deleted" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an appropriate response
    return ErrorHandler(request, error);
  }
};
