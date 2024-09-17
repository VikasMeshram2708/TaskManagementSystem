import { loginUserSchema } from "@/app/models/UserSchema";
import { ConnectDB } from "@/lib/DbConfig";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { prismaInstance } from "@/lib/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody: loginUserSchema = await request.json();

    // Sanitize the incoming data
    const parsedUser = loginUserSchema.parse(reqBody);

    // Connect to db
    await ConnectDB();

    const userExist = await prismaInstance.user.findFirst({
      where: {
        email: parsedUser?.email,
      },
    });

    if (!userExist) {
      throw new Error("User Doesn't Exist");
    }

    // compare hashed password

    const isValidPassword = await bcrypt.compare(
      parsedUser?.password,
      userExist?.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }

    return NextResponse.json(
      {
        message: "User Logged In",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};
