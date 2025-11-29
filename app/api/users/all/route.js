import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
