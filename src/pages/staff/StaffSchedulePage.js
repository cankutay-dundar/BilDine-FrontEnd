import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getRegularShifts } from "../../api/staffApi";

const dayName = (d) => {
  // backend bazen 0..6 (Sun..Sat) veya 1..7 (Mon..Sun) gelebilir
  const map0 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const map1 = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (d === null || d === undefined) return "—";
  if (d >= 0 && d <= 6) return map0[d];
  if (d >= 1 && d <= 7) return map1[d];
  return String(d);
};

export default function StaffSchedulePage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const da = a.dayOfWeek ?? a.day_of_week ?? 0;
      const db = b.dayOfWeek ?? b.day_of_week ?? 0;
      const sa = a.start ?? a.startTime ?? a.start_time ?? "";
      const sb = b.start ?? b.startTime ?? b.start_time ?? "";
      if (da !== db) return da - db;
      return String(sa).localeCompare(String(sb));
    });
    return copy;
  }, [rows]);

  useEffect(() => {
    const run = async () => {
      setErr("");
      setLoading(true);
      try {
        const data = await getRegularShifts(user.userId);
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user.userId]);

  return (
    <div>
      <h2>📅 My Regular Shifts</h2>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
                  Day
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
                  Start
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
                  End
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 10, color: "#666" }}>
                    No regular shifts found.
                  </td>
                </tr>
              ) : (
                sorted.map((r, idx) => {
                  const d = r.dayOfWeek ?? r.day_of_week;
                  const start = r.start ?? r.startTime ?? r.start_time;
                  const end = r.end ?? r.endTime ?? r.end_time;
                  return (
                    <tr key={idx}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                        {dayName(d)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                        {String(start)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>
                        {String(end)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
