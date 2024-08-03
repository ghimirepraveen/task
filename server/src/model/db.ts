import { PrismaClient } from "@prisma/client";
import customError from "../error/custome.error";

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database.");
  } catch (error) {
    throw new customError("Failed to connect to the database.", 500);
  }
}

connectToDatabase();

export { prisma };
