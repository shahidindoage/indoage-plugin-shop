import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req) {
  const { email, product } = await req.json();

  if (!email || !product) {
    return NextResponse.json({ success: false, message: "Email & product required" });
  }

  const licenseKey = nanoid(20).toUpperCase();

  const newLicense = await prisma.license.create({
    data: {
      license: licenseKey,
      email,
      product,
    },
  });

  return NextResponse.json({
    success: true,
    license: newLicense.license
  });
}
