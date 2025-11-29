"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading analytics...</p>;

  if (!analytics) return <p style={{ textAlign: "center" }}>No analytics data found.</p>;

  // Safe mapping
  const paymentStatusData = analytics?.ordersByStatus?.map((item) => ({
    name: item.paymentStatus,
    value: item._count?.id || 0,
  })) || [];

  const monthlyRevenueData = Object.entries(analytics?.monthlyRevenue || {}).map(([month, revenue]) => ({
    month,
    revenue: revenue / 100,
  }));

  const topProductsData = (analytics?.topProducts || []).map((p) => ({
    name: p.title,
    sold: p._sum?.quantity || 0,
  }));

  const ordersPerDayData = (analytics?.ordersPerDay || []).map((item) => ({
    date: item.date,
    orders: item._count?.id || 0,
  }));

  const newUsersPerDayData = (analytics?.newUsersPerDay || []).map((item) => ({
    date: item.date,
    users: item._count?.id || 0,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Metrics Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
        <Card title="Total Products" value={analytics.totalProducts} />
        <Card title="Total Orders" value={analytics.totalOrders} />
        <Card title="Total Users" value={analytics.totalUsers} />
        <Card title="Total Revenue" value={`₹${(analytics.totalRevenue / 100).toFixed(2)}`} />
        <Card title="New Users (7d)" value={analytics.newUsersLast7Days} />
        <Card title="Active Licenses" value={analytics.activeLicenses} />
        <Card title="Inactive Licenses" value={analytics.inactiveLicenses} />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
        {/* Orders by Payment Status */}
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <h3>Orders by Payment Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Per Day */}
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <h3>Orders Per Day</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ordersPerDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* New Users Per Day */}
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <h3>New Users Per Day</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newUsersPerDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Card Component
function Card({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h4 style={{ marginBottom: 10 }}>{title}</h4>
      <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
