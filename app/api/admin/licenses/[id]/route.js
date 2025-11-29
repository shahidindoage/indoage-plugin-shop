import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE license
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.license.delete({ where: { id } });
    return NextResponse.json({ message: "License deleted successfully" });
  } catch (err) {
    console.error("Delete license failed:", err);
    return NextResponse.json({ error: "Failed to delete license" }, { status: 500 });
  }
}

// PATCH license (update isActive)
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { isActive } = body;

  try {
    const updated = await prisma.license.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update license failed:", err);
    return NextResponse.json({ error: "Failed to update license" }, { status: 500 });
  }
}
