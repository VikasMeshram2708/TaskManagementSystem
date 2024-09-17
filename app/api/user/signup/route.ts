import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { clientUserSchema } from "@/app/models/UserSchema";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody: clientUserSchema = await request.json();

    // Sanitize the incoming data
    const parsedResult = clientUserSchema.safeParse(reqBody);

    if (!parsedResult.success) {
      throw new Error("Invalid Data Received");
    }

    const parsedUser = parsedResult?.data;

    // Connect to db
    await ConnectDB();

    const userExist = await prismaInstance.user.findFirst({
      where: {
        email: parsedUser?.email,
      },
    });

    if (userExist) {
      throw new Error("User Already Exist");
    }

    // hash the password

    const hashedPassword = await bcrypt.hash(parsedUser?.password, 10);

    await prismaInstance.user.create({
      data: {
        firstname: parsedUser?.firstname,
        lastname: parsedUser?.lastname,
        email: parsedUser?.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User Registered",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
