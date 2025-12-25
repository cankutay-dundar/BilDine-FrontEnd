import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { addAvailability, deleteAvailability } from "../../api/staffApi";

export default function StaffAvailabilityPage() {
  const { user } = useAuth();

  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const [cDate, setCDate] = useState("");
  const [cStart, setCStart] = useState("09:00");
  const [cEnd, setCEnd] = useState("17:00");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");

    if (!user?.userId) {
      setErr("No user logged in. Please login first.");
      return;
    }

    if (!date || !start || !end) {
      setErr("Please provide date, start, and end times.");
      return;
    }

    try {
      const res = await addAvailability(user.userId, { date, start, end });
      setMsg(res?.message || "Availability request submitted");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  const cancel = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");

    if (!user?.userId) {
      setErr("No user logged in. Please login first.");
      return;
    }

    if (!cDate || !cStart || !cEnd) {
      setErr("Please provide date, start, and end times for cancellation.");
      return;
    }

    try {
      const res = await deleteAvailability(user.userId, { date: cDate, start: cStart, end: cEnd });
      setMsg(res?.message || "Availability request deleted");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div>
      <h2>🕒 Availability</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Submit an availability request (date + start + end). You can also cancel it by providing the same values.
      </p>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <form onSubmit={submit} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Submit Availability</h3>

          <label>Date</label><br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /><br /><br />

          <label>Start</label><br />
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required /><br /><br />

          <label>End</label><br />
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required /><br /><br />

          <button type="submit">Submit</button>
        </form>

        <form onSubmit={cancel} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Cancel Availability</h3>

          <label>Date</label><br />
          <input type="date" value={cDate} onChange={(e) => setCDate(e.target.value)} required /><br /><br />

          <label>Start</label><br />
          <input type="time" value={cStart} onChange={(e) => setCStart(e.target.value)} required /><br /><br />

          <label>End</label><br />
          <input type="time" value={cEnd} onChange={(e) => setCEnd(e.target.value)} required /><br /><br />

          <button type="submit">Cancel</button>
        </form>
      </div>
    </div>
  );
}
