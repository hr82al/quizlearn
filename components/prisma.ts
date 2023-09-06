import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const log = console.log;