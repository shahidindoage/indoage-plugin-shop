import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE a user
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Optional: Delete related records first to avoid FK errors
    await prisma.license.deleteMany({ where: { userId: id } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: id } } });
    await prisma.order.deleteMany({ where: { userId: id } });
    await prisma.product.deleteMany({ where: { createdById: id } });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user failed:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
