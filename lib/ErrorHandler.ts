import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export function ErrorHandler(request: NextRequest, error: unknown) {
  const err = error as Error;

  if (err instanceof PrismaClientKnownRequestError) {
    return NextResponse.json(
      {
        message: err?.message,
      },
      {
        status: 500,
      }
    );
  }
  if (err instanceof ZodError) {
    const filteredErr = err?.issues?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return NextResponse.json(
      {
        message: filteredErr,
      },
      {
        status: 500,
      }
    );
  }
  return NextResponse.json(
    {
      message: `"An unexpected error occurred", ${error}`,
    },
    {
      status: 500,
    }
  );
}
