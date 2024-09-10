import { LoginUserSchema } from "@/app/models/User";
import { ConnectDB } from "@/helpers/DB";
import ErrorHandler from "@/helpers/ErrorHandler";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const reqBody = await request.json();

    // sanitize the data
    const user = LoginUserSchema.parse(reqBody);

    // connect to DB
    await ConnectDB();

    // query to db
    const emailExist = await prismaInstance.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!emailExist) {
      return NextResponse.json(
        {
          message: "User isn't Registered",
        },
        {
          status: 400,
        }
      );
    }
    // compare the password
    const isValidPassword = await bcrypt.compare(
      user.password,
      emailExist.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid Credentials",
        },
        {
          status: 400,
        }
      );
    }

    // return the res
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
