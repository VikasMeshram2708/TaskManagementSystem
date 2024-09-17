import { prismaInstance } from "./PrismaInstance";

export async function ConnectDB() {
  try {
    await prismaInstance.$connect();
  } catch (error) {
    console.log(`Something went wrong. Db connection failed :${error}`);
  } finally {
    await prismaInstance.$disconnect();
  }
}
