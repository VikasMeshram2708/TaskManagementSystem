import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { GetDataFromToken } from "@/lib/GetDataFromToken";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const token = await GetDataFromToken(request);

    // Connect to the database
    await ConnectDB();

    // Create a new task in the database
    const tasks = await prismaInstance.task.findMany({
      where: {
        user: {
          email: String(token?.email),
        },
      },
    });

    // Return a success response
    return NextResponse.json({ tasks }, { status: 201 });
  } catch (error) {
    // Handle errors and return an appropriate response
    return ErrorHandler(request, error);
  }
};
