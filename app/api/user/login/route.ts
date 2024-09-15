import { UserSchemaLogin } from "@/app/models/UserSchema";
import { ConnectDb } from "@/helpers/DbConfig";
import { ErrorHandler } from "@/helpers/ErrorHandler";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    // Sanitize input data
    const user = UserSchemaLogin.parse(reqBody);

    // Connect to the database
    await ConnectDb();

    // Validate email
    const userRecord = await prismaInstance.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!userRecord) {
      return NextResponse.json(
        {
          message: "User doesn't exist",
        },
        {
          status: 422,
        }
      );
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      user.password,
      userRecord.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 422,
        }
      );
    }

    const newUser = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      createdAt: userRecord.createdAt,
    };
    // Return success response
    return NextResponse.json(
      {
        message: "User logged in successfully",
        user: newUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return ErrorHandler(request, error);
  }
};