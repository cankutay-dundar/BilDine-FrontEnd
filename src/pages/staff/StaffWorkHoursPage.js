import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { checkIn, checkOut } from "../../api/staffApi";

export default function StaffWorkHoursPage() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    setErr(""); setMsg("");
    setLoading(true);
    try {
      const res = await fn(user.userId);
      setMsg(res?.message || "OK");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>✅ Work Hours</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Check-in / check-out endpoints are stubs in service, but controller returns success messages.
      </p>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button disabled={loading} onClick={() => run(checkIn)}>
          Check In
        </button>
        <button disabled={loading} onClick={() => run(checkOut)}>
          Check Out
        </button>
      </div>
    </div>
  );
}
