import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { license } = await req.json();

  if (!license) return NextResponse.json({ valid: false });

  const found = await prisma.license.findUnique({
    where: { license }
  });

  return NextResponse.json({ valid: !!found });
}
