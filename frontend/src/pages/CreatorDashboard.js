import React, { useEffect, useState } from "react";
import API from "../api/axios";

const input = {
  width: "100%", padding: "0.5rem 0.8rem", borderRadius: 6,
  border: "1px solid #cbd5e1", fontSize: "0.95rem",
};

const emptySession = {
  title: "", description: "", image: "", date: "",
  duration_minutes: 60, max_participants: 20, price: 0,
};

export default function CreatorDashboard() {
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptySession);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    API.get("/sessions/?mine=true").then((r) => setSessions(r.data.results || r.data));
    API.get("/bookings/creator/").then((r) => setBookings(r.data.results || r.data));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.patch(`/sessions/${editing}/`, form);
        setMsg("Session updated.");
      } else {
        await API.post("/sessions/", form);
        setMsg("Session created.");
      }
      setForm(emptySession);
      setEditing(null);
      load();
    } catch {
      setMsg("Failed to save session.");
    }
  };

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({
      title: s.title, description: s.description, image: s.image,
      date: s.date?.slice(0, 16), duration_minutes: s.duration_minutes,
      max_participants: s.max_participants, price: s.price,
    });
  };

  const deleteSession = async (id) => {
    await API.delete(`/sessions/${id}/`);
    load();
  };

  return (
    <div>
      <h1>Creator Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "0.8rem", maxWidth: 500 }}>
        <h3>{editing ? "Edit Session" : "Create New Session"}</h3>
        <input style={input} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea style={{ ...input, minHeight: 80 }} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input style={input} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input style={input} type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input style={input} type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: +e.target.value })} />
          <input style={input} type="number" placeholder="Max participants" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: +e.target.value })} />
          <input style={input} type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
        </div>
        <button type="submit" style={{ padding: "0.6rem", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer" }}>
          {editing ? "Update" : "Create"} Session
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm(emptySession); }} style={{ padding: "0.6rem", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>
            Cancel Edit
          </button>
        )}
        {msg && <p style={{ color: msg.includes("Failed") ? "red" : "green" }}>{msg}</p>}
      </form>

      <h2 style={{ marginTop: "2rem" }}>Your Sessions ({sessions.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.8rem" }}>
        {sessions.map((s) => (
          <div key={s.id} style={{ padding: "1rem", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{s.title}</strong>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{new Date(s.date).toLocaleString()} &middot; {s.spots_left}/{s.max_participants} spots</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => startEdit(s)} style={{ padding: "0.4rem 0.8rem", borderRadius: 6, border: "1px solid #7c3aed", color: "#7c3aed", background: "#fff", cursor: "pointer" }}>Edit</button>
              <button onClick={() => deleteSession(s.id)} style={{ padding: "0.4rem 0.8rem", borderRadius: 6, border: "1px solid #ef4444", color: "#ef4444", background: "#fff", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Bookings for Your Sessions ({bookings.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.8rem" }}>
        {bookings.map((b) => (
          <div key={b.id} style={{ padding: "0.8rem", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff" }}>
            <strong>{b.session?.title}</strong> — {b.status}
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Booked at {new Date(b.created_at).toLocaleString()}</div>
          </div>
        ))}
        {bookings.length === 0 && <p style={{ color: "#888" }}>No bookings yet.</p>}
      </div>
    </div>
  );
}