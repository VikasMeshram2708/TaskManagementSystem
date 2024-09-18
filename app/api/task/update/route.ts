import { UpdateTaskSchema } from "@/app/models/TaskSchema";
import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    // const token = await GetDataFromToken(request);

    // Parse and validate the request body
    const reqBody = await request.json();

    const taskResult = UpdateTaskSchema.safeParse(reqBody);

    if (!taskResult.success) {
      throw new Error("Invalid data");
    }

    const parsedTask = taskResult.data;

    // Connect to the database
    await ConnectDB();

    // Create a new task in the database
    await prismaInstance.task.update({
      where: {
        id: String(parsedTask?.id),
      },
      data: {
        title: parsedTask?.title,
        description: parsedTask?.description,
        status: parsedTask?.status,
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Task Updated" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an appropriate response
    return ErrorHandler(request, error);
  }
};
