import { ConnectDB } from "helpers/DB";
import ErrorHandler from "helpers/ErrorHandler";
import { GetUserData } from "helpers/GetUserData";
import { prismaInstance } from "helpers/PrismaInstance";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const user = await GetUserData(request);
    // connect to DB
    await ConnectDB();

    const userData = await prismaInstance.user.findFirst({
      where: {
        email: user?.email,
      },
    });

    return NextResponse.json({
      data: userData,
    });
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
