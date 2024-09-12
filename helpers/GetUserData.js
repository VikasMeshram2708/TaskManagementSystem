import { getToken } from "next-auth/jwt";

export async function GetUserData(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) return undefined;
    return token;
  } catch (error) {
    console.log(`Something went wrong. Failed to get User Data ${error}`);
  }
}
