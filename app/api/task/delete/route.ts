import { DeleteTaskSchema } from "@/app/models/TaskSchema";
import { ConnectDb } from "@/helpers/DbConfig";
import { ErrorHandler } from "@/helpers/ErrorHandler";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  try {
    const token = await GetDataFromToken(request);

    const reqBody = await request.json();

    const task = DeleteTaskSchema.parse(reqBody);

    await ConnectDb();

    const findTask = await prismaInstance.task.findFirst({
      where: {
        id: task?.id,
      },
    });

    if (!findTask) {
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
        id: task.id,
        user: {
          id: String(token?.id),
        },
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
