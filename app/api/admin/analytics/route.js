import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total products
    const totalProducts = await prisma.product.count();

    // Total orders
    const totalOrders = await prisma.order.count();

    // Total users
    const totalUsers = await prisma.user.count();

    // Total revenue
    const revenueData = await prisma.order.aggregate({
      _sum: { totalCents: true },
    });
    const totalRevenue = revenueData._sum.totalCents || 0;

    // Orders per day (last 7 days)
    const ordersLast7Days = await prisma.order.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    // Orders by payment status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["paymentStatus"],
      _count: { id: true },
    });

    // Top selling products (last 30 days)
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "title"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      where: {
        order: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      },
      take: 5,
    });

    // New users last 7 days
    const newUsersLast7Days = await prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const monthlyRevenueRaw = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalCents: true },
      where: { createdAt: { gte: sixMonthsAgo } },
    });

    const monthlyRevenue = {};
    monthlyRevenueRaw.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (item._sum.totalCents || 0);
    });

    // Active / Inactive licenses
    const activeLicenses = await prisma.license.count({ where: { isActive: true } });
    const inactiveLicenses = await prisma.license.count({ where: { isActive: false } });

    // Orders per day last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const ordersPerDayRaw = await prisma.order.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const ordersPerDay = ordersPerDayRaw.map((o) => ({
      date: o.createdAt.toISOString().split("T")[0],
      _count: o._count,
    }));

    // New users per day last 30 days
    const newUsersPerDayRaw = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const newUsersPerDay = newUsersPerDayRaw.map((u) => ({
      date: u.createdAt.toISOString().split("T")[0],
      _count: u._count,
    }));

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      ordersLast7Days,
      ordersByStatus,
      topProducts,
      newUsersLast7Days,
      monthlyRevenue,
      activeLicenses,
      inactiveLicenses,
      ordersPerDay,
      newUsersPerDay,
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
