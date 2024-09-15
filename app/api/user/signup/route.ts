import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { ErrorHandler } from "@/helpers/ErrorHandler";
import { ConnectDb } from "@/helpers/DbConfig";
import { CreateUserSchema } from "@/app/models/UserSchema";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    // Sanitize inc data
    const user = CreateUserSchema.parse(reqBody);

    // connect db
    await ConnectDb();

    // validate email
    const emailExist = await prismaInstance.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (emailExist) {
      return NextResponse.json(
        {
          message: "User Already Registered",
        },
        {
          status: 422,
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // query db
    await prismaInstance.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    // return res
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
