import { prisma } from "@/components/prisma";
import { CategoryEnum, Quiz } from "@prisma/client";
import { NextResponse } from "next/server";

const LIMIT = 1000;


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
      
      /*
      for requests like
      {
        "categories": ["TS", "CSS"],
        "num": 3
      }
      */
      if (isCategoryRes(json)) {
        const query = (`SELECT * FROM public."Quiz" WHERE category IN (${json.categories.map(c => `'${c}'`)}) ORDER BY RANDOM() LIMIT ${json.num}`);
        const result = await prisma.$queryRawUnsafe<Quiz[]>(query);
        return NextResponse.json(result, { status: 200 });
      }
      
      return NextResponse.json({ error: `Unknown request`, request: json}, { status: 500 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500});
    }
  }

  export async function GET(_request: Request) {
    try {
      const query = (`SELECT * FROM public."Quiz"  ORDER BY RANDOM() LIMIT ${LIMIT}`);
        const result = await prisma.$queryRawUnsafe<Quiz[]>(query);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500});
    }
  }