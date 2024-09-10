import { CreateUserSchema } from "@/app/models/User";
import { ConnectDB } from "@/helpers/DB";
import ErrorHandler from "@/helpers/ErrorHandler";
import { prismaInstance } from "@/helpers/PrismaInstance";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const reqBody = await request.json();

    // sanitize the data
    const user = await CreateUserSchema.parse(reqBody);

    // connect to DB
    await ConnectDB();

    // query to db
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
          status: 400,
        }
      );
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prismaInstance.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: hashedPassword,
      },
    });

    // return the res
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
