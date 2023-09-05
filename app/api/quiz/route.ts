import { log, prisma } from "@/components/prisma";
import { CategoryEnum, Quiz } from "@prisma/client";
import { NextResponse } from "next/server";


function isNumber(value: string | null): boolean {
  if (typeof value !== "string") {
    return false;
  } else if (!isNaN(Number(value)) && value !== "") {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const n = searchParams.get("n");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    if (isNumber(n)) {
      const result = await prisma.quiz.findFirst({ skip: Number(n) });
      return NextResponse.json(result, { status: 200 });
    } else if (isNumber(start) && isNumber(end)) {
      const result = await prisma.quiz.findMany({
        skip: Number(start),
        take: Number(end) - Number(start),
      });
      return NextResponse.json(result, { status: 200 });
    } 
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ error: `Error: n: ${n}, start: ${start}, end: ${end}`}, { status: 500 });
}

export interface CategoriesReq {
  categories: CategoryEnum[],
  num: number,
}

function isCategory(value: any): value is CategoryEnum[] {
  return value in CategoryEnum;
}


function isCategoryRes(v: any): v is CategoriesReq {
  return v.categories.every(isCategory) && (v as CategoriesReq).num !== undefined;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    log(json);
    log(isCategoryRes(json))
    if (isCategoryRes(json)) {
      const query = (`SELECT * FROM public."Quiz" WHERE category IN (${json.categories.map(c => `'${c}'`)}) ORDER BY RANDOM() LIMIT ${json.num}`);
      const result = await prisma.$queryRawUnsafe<Quiz[]>(query);
      log(result)
      return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json( {}, { status: 500 });
  } catch (error) {
    return NextResponse.json({error}, { status: 500 });
  }
}