import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function SessionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [booking, setBooking] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get(`/sessions/${id}/`).then((r) => setSession(r.data)).catch(() => setMsg("Session not found."));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    setBooking(true);
    try {
      await API.post("/bookings/", { session: session.id });
      setMsg("Booked successfully!");
    } catch (e) {
      setMsg(e.response?.data?.detail || e.response?.data?.non_field_errors?.[0] || "Booking failed.");
    } finally {
      setBooking(false);
    }
  };

  if (!session) return <p>{msg || "Loading..."}</p>;

  return (
    <div style={{ maxWidth: 700 }}>
      {session.image && <img src={session.image} alt={session.title} style={{ width: "100%", borderRadius: 12, marginBottom: "1rem" }} />}
      <h1>{session.title}</h1>
      <p style={{ color: "#64748b", margin: "0.5rem 0" }}>
        By {session.creator?.first_name || session.creator?.username} &middot;{" "}
        {new Date(session.date).toLocaleString()} &middot; {session.duration_minutes} min
      </p>
      <p style={{ margin: "1rem 0", lineHeight: 1.6 }}>{session.description}</p>
      <p><strong>Price:</strong> ${session.price} &middot; <strong>Spots left:</strong> {session.spots_left}</p>
      {msg && <p style={{ color: msg.includes("success") ? "green" : "red", marginTop: "0.5rem" }}>{msg}</p>}
      <button
        onClick={handleBook}
        disabled={booking || session.spots_left <= 0}
        style={{
          marginTop: "1.5rem", padding: "0.7rem 2rem", borderRadius: 8, border: "none",
          background: session.spots_left > 0 ? "#7c3aed" : "#ccc", color: "#fff",
          fontSize: "1rem", cursor: session.spots_left > 0 ? "pointer" : "not-allowed",
        }}
      >
        {session.spots_left > 0 ? "Book Now" : "Fully Booked"}
      </button>
    </div>
  );
}