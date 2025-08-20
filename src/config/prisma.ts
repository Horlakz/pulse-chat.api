import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {}

export async function connectDB() {
  try {
    const db = new PrismaService();
    await db.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}
