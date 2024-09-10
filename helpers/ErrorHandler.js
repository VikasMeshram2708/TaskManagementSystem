import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export default function ErrorHandler(request, error) {
  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    console.error("Prisma Error:", error);

    // Specific error codes handling can be added here based on Prisma documentation
    return NextResponse.json(
      {
        message: "A database error occurred. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((issue) => ({
      field: issue.path.join("."), // Join path elements for better readability
      message: issue.message,
    }));

    console.warn("Validation Error:", validationErrors);

    return NextResponse.json(
      {
        errors: validationErrors,
        message: "Validation failed. Please check the input data.",
      },
      {
        status: 400, // Bad Request for validation errors
      }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    console.error("Unexpected Error:", error);

    return NextResponse.json(
      {
        message: "An unexpected error occurred. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }

  // Fallback for unknown error types
  console.error("Unknown Error:", error);

  return NextResponse.json(
    {
      message: "An unknown error occurred.",
    },
    {
      status: 500,
    }
  );
}
