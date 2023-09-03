import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const req = await request.json();
    if ("name" in req && "bcrypt_hash" in req) {
      const result = await prisma.user.create({
        data: {
          name: req.name,
          bcryptHash: req.bcrypt_hash,
        }
      });
      return NextResponse.json(result, { status: 200});
    }
    if ("name" in req) {
      const result = await prisma.user.findFirst({
        where: {
          name: req.name,
        }
      });
      return NextResponse.json(result, { status: 200});
    }
    return NextResponse.json({error: "Wrong request format"}, { status: 500});
  } catch (error) {
    return NextResponse.json(error, { status: 500});
  }
}