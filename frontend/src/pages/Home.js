import React, { useEffect, useState } from "react";
import API from "../api/axios";
import SessionCard from "../components/SessionCard";

const grid = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1.5rem", marginTop: "1.5rem",
};

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/sessions/", { params: { search } })
      .then((r) => setSessions(r.data.results || r.data))
      .catch(() => setError("Failed to load sessions."));
  }, [search]);

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Session Catalog</h1>
      <input
        type="text"
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginTop: "1rem", padding: "0.6rem 1rem", width: "100%", maxWidth: 400,
          borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "1rem",
        }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={grid}>
        {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
      </div>
      {sessions.length === 0 && !error && <p style={{ marginTop: "2rem", color: "#888" }}>No sessions found.</p>}
    </div>
  );
}