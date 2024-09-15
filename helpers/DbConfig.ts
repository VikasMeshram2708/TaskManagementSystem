import { prismaInstance } from "./PrismaInstance";

export async function ConnectDb() {
  try {
    await prismaInstance.$connect();
  } catch (error) {
    console.log(`Something went wrong. Failed to Connect to DB :${error}`);
  } finally {
    await prismaInstance.$disconnect();
  }
}
