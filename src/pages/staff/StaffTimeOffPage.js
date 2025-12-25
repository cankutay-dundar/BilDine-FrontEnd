import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { addTimeOff, deleteTimeOff } from "../../api/staffApi";

export default function StaffTimeOffPage() {
  const { user } = useAuth();

  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const [cDate, setCDate] = useState("");
  const [cStart, setCStart] = useState("09:00");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Format HH:mm -> HH:mm:ss for backend
  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.length === 5) return timeStr + ":00";
    return timeStr;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.userId) return setErr("User not logged in");

    setErr(""); 
    setMsg("");
    try {
      const res = await addTimeOff(user.userId, {
        date,
        start: formatTime(start),
        end: formatTime(end)
      });
      setMsg(res?.message || "Time-off request submitted");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  const cancel = async (e) => {
    e.preventDefault();
    if (!user?.userId) return setErr("User not logged in");

    setErr(""); 
    setMsg("");
    try {
      const res = await deleteTimeOff(user.userId, {
        date: cDate,
        start: formatTime(cStart)
      });
      setMsg(res?.message || "Time-off request deleted");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div>
      <h2>🛑 Time-Off</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Submit a time-off request (date + start + end). Cancel uses (date + start) as in backend controller.
      </p>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <form onSubmit={submit} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Submit Time-Off</h3>

          <label>Date</label><br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /><br /><br />

          <label>Start</label><br />
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required /><br /><br />

          <label>End</label><br />
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required /><br /><br />

          <button type="submit">Submit</button>
        </form>

        <form onSubmit={cancel} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Cancel Time-Off</h3>

          <label>Date</label><br />
          <input type="date" value={cDate} onChange={(e) => setCDate(e.target.value)} required /><br /><br />

          <label>Start</label><br />
          <input type="time" value={cStart} onChange={(e) => setCStart(e.target.value)} required /><br /><br />

          <button type="submit">Cancel</button>
        </form>
      </div>
    </div>
  );
}
