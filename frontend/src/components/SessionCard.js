import React from "react";
import { Link } from "react-router-dom";

const card = {
  border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden",
  background: "#fff", transition: "box-shadow 0.2s",
  display: "flex", flexDirection: "column",
};
const img = { width: "100%", height: 180, objectFit: "cover", background: "#ddd" };
const body = { padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" };
const title = { fontSize: "1.1rem", fontWeight: 600 };
const meta = { fontSize: "0.85rem", color: "#64748b" };
const btn = {
  marginTop: "auto", padding: "0.5rem", borderRadius: 8, border: "none",
  background: "#7c3aed", color: "#fff", cursor: "pointer", textAlign: "center",
  textDecoration: "none", fontSize: "0.9rem",
};

export default function SessionCard({ session }) {
  return (
    <div style={card}>
      {session.image ? <img src={session.image} alt={session.title} style={img} /> : <div style={img} />}
      <div style={body}>
        <div style={title}>{session.title}</div>
        <div style={meta}>
          {new Date(session.date).toLocaleDateString()} &middot; {session.duration_minutes} min
        </div>
        <div style={meta}>{session.spots_left} spots left &middot; ${session.price}</div>
        <Link to={`/sessions/${session.id}`} style={btn}>View Details</Link>
      </div>
    </div>
  );
}