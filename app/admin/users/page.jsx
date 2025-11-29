"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        alert("User deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Users</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Products</th>
            <th>Orders</th>
            <th>Licenses</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ textAlign: "center" }}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user._count.products}</td>
              <td>{user._count.orders}</td>
              <td>{user._count.License}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse" },
  deleteBtn: {
    padding: "5px 10px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
};
