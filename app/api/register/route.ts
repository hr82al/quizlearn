import { prisma } from "@/components/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const req = await request.json();
    // register user
    if ("name" in req && "bcrypt_hash" in req && "email" in req) {
      const result = await prisma.user.create({
        data: {
          name: req.name,
          bcryptHash: req.bcrypt_hash,
          email: req.email,
        }
      });
      return NextResponse.json(result, { status: 200});
    }
    // check if user already registered
    if ("name" in req && "email" in req) {
      const result = await prisma.user.findFirst({
        where: {
          name: req.name,
          email: req.email,
        }
      });
      return NextResponse.json(result, { status: 200});
    }
    return NextResponse.json({error: "Wrong request format"}, { status: 500});
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500});
  }
}