import { CreateTaskSchema } from "@/app/models/TaskSchema";
import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { GetDataFromToken } from "@/lib/GetDataFromToken";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const token = await GetDataFromToken(request);
    console.log('oncreate', token)

    // Parse and validate the request body
    const reqBody = await request.json();

    const taskResult = CreateTaskSchema.safeParse(reqBody);
    if (!taskResult.success) {
      throw new Error("Invalid data");
    }

    const parsedTask = taskResult.data;

    // Connect to the database
    await ConnectDB();

    // Create a new task in the database
    await prismaInstance.task.create({
      data: {
        title: parsedTask?.title,
        description: parsedTask?.description,
        status: parsedTask?.status,
        user: {
          connect: {
            email: String(token?.email),
          },
        },
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Task Created" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an appropriate response
    return ErrorHandler(request, error);
  }
};
