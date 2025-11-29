import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const licenses = await prisma.license.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json(licenses);
  } catch (err) {
    console.error("Fetch licenses failed:", err);
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
  }
}
