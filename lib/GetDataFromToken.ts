import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GetDataFromToken(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("data-fromt-token", token);

    if (!token) return undefined;
    return token;
  } catch (error) {
    throw new Error("Authentication Failed");
  }
}
