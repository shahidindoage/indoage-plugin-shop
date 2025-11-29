import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}
