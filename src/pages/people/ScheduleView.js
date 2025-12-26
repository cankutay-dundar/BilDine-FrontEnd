import { useState } from "react";
import { getRegularShiftByUserId } from "../../api/peopleApi";

const DAYS = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday"
];

function ScheduleView() {
  const [userId, setUserId] = useState("");
  const [regular, setRegular] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await getRegularShiftByUserId(userId);
      console.log("REGULAR SHIFT RESPONSE:", data);

      setRegular(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRegular([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h2>📅 Regular Weekly Schedule</h2>

      <input
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button onClick={load} disabled={loading}>
        {loading ? "Loading..." : "Load"}
      </button>

      <table border="1" width="100%" cellPadding="6">
        <thead>
          <tr>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {regular.length === 0 && !loading && (
            <tr>
              <td colSpan="3" align="center">
                No regular shifts
              </td>
            </tr>
          )}

          {regular.map((r, i) => (
            <tr key={i}>
              <td>{DAYS[r.dayOfWeek]}</td>
              <td>{r.startTime}</td>
              <td>{r.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleView;
