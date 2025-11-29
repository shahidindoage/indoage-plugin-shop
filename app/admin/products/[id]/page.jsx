import { prisma } from "@/lib/prisma";
import ProductDetailsClient from "@/components/ProductDetailsClient";

export default async function ProductDetailsPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return <h1 style={{ padding: 30 }}>Product not found</h1>;
  }

  // Pass product data to client component
  return <ProductDetailsClient product={product} />;
}
