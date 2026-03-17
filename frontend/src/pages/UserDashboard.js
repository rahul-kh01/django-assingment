import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const card = {
  padding: "1rem", border: "1px solid #e2e8f0", borderRadius: 10,
  background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/").then((r) => setBookings(r.data.results || r.data));
  }, []);

  const cancel = async (id) => {
    await API.patch(`/bookings/${id}/cancel/`);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  const active = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) => b.status === "cancelled");

  return (
    <div>
      <h1>Welcome, {user?.first_name || user?.username}</h1>
      <h2 style={{ marginTop: "1.5rem" }}>Active Bookings ({active.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.8rem" }}>
        {active.map((b) => (
          <div key={b.id} style={card}>
            <div>
              <strong>{b.session.title}</strong>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                {new Date(b.session.date).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => cancel(b.id)}
              style={{ padding: "0.4rem 1rem", borderRadius: 6, border: "1px solid #ef4444", background: "#fff", color: "#ef4444", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        ))}
        {active.length === 0 && <p style={{ color: "#888" }}>No active bookings.</p>}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Past / Cancelled ({past.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.8rem" }}>
        {past.map((b) => (
          <div key={b.id} style={{ ...card, opacity: 0.6 }}>
            <div>
              <strong>{b.session.title}</strong>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{b.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}