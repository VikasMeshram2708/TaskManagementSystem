import { ConnectDB } from "helpers/DB";
import ErrorHandler from "helpers/ErrorHandler";
import { GetUserData } from "helpers/GetUserData";
import { prismaInstance } from "helpers/PrismaInstance";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const user = await GetUserData(request);

    // console.log('user', user)

    // if (!user || !user.email) {
    //   return NextResponse.json(
    //     { error: "Authentication required" },
    //     { status: 401 }
    //   );
    // }

    // connect db
    await ConnectDB();

    const tasks = await prismaInstance.task.findMany({
      where: {
        userEmail: user?.email,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        tasks: tasks,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
