import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GetDataFromToken(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return undefined;

  return token;
}
