import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  let event;

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      const address = session.metadata.address || "";
      const productIds = JSON.parse(session.metadata.productIds);

      // Fetch product data
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      // Fetch user email
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // 3️⃣ Create Order
      const order = await prisma.order.create({
        data: {
          userId,
          address,
          totalCents: session.amount_total,
          paymentMethod: "online",
          paymentStatus: "paid",
        },
      });

      // 4️⃣ Order Items and license keys
      const itemsToInsert = [];
      const emailItems = []; // For email

      for (const product of products) {
        const licenseKey = nanoid(20);

        await prisma.license.create({
          data: {
            key: licenseKey,
            userId,
            productId: product.id,
            isActive: true,
            domain: null,
          },
        });

        const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${product.id}`;

        itemsToInsert.push({
          orderId: order.id,
          productId: product.id,
          logoUrl:product.logoUrl,
          title: product.title,
          quantity: 1,
          priceCents: product.priceCents,
          downloadLink,
          licenseKey,
        });

        emailItems.push({
          title: product.title,
          licenseKey,
          downloadLink,
        });
      }

      await prisma.orderItem.createMany({ data: itemsToInsert });

      // 5️⃣ Send Email using Resend
      const emailHtml = `
        <h2>Thank you for your purchase!</h2>
        <p>Your order ID: <strong>${order.id}</strong></p>

        <h3>Products:</h3>

        ${emailItems
          .map(
            (item) => `
          <div style="margin-bottom:20px;">
            <p><strong>${item.title}</strong></p>
            <p>License Key: <code>${item.licenseKey}</code></p>
            <p>Download: <a href="${item.downloadLink}">Click here</a></p>
          </div>
        `
          )
          .join("")}

        <p>If you face any issue, reply to this email.</p>
      `;

      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: address,
        subject: "Your Purchase Details & License Keys",
        html: emailHtml,
      });

      console.log("📧 Email sent to:", address);

      console.log("✅ ORDER + LICENSES CREATED + EMAIL SENT:", order.id);
    } catch (error) {
      console.error("❌ Webhook error:", error);
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
