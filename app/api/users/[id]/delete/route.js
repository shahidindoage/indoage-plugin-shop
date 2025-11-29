// app/api/users/[id]/delete/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete all orders for the user first
    await prisma.order.deleteMany({
      where: { userId: id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User and their orders deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
