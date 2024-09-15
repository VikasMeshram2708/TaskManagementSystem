import { UpdateTaskSchema } from "@/app/models/TaskSchema";
import { ConnectDb } from "@/helpers/DbConfig";
import { ErrorHandler } from "@/helpers/ErrorHandler";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const token = await GetDataFromToken(request);
    const reqBody = await request.json();

    const task = UpdateTaskSchema.parse(reqBody);

    await ConnectDb();

    await prismaInstance.task.update({
      where: {
        id: task?.id,
      },
      data: {
        title: task?.title,
        description: task?.description,
        status: task?.status,
        user: {
          connect: {
            id: String(token?.id),
          },
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Task Created",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
