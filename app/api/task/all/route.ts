import { ConnectDb } from "@/helpers/DbConfig";
import { ErrorHandler } from "@/helpers/ErrorHandler";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const token = await GetDataFromToken(request);

    await ConnectDb();

    const tasks = await prismaInstance.task.findMany({
      where: {
        user: {
          id: String(token?.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        tasks,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
