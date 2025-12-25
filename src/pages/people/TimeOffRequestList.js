import { useEffect, useState } from "react";
import {
  getTimeOffRequests,
  approveTimeOff,
  rejectTimeOff
} from "../../api/peopleApi";

function TimeOffRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load pending time-off requests
  const load = async () => {
    setLoading(true);
    try {
      const data = await getTimeOffRequests();
      console.log("📥 TIME OFF REQUESTS:", data);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load time-off requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Approve handler
  const approve = async (r) => {
    try {
      await approveTimeOff(r.userId, r.date);
      alert("Time-off request approved");
      load();
    } catch (err) {
      alert("Failed to approve time-off request");
      console.error(err);
    }
  };

  // ✅ Reject handler (THIS is where it goes)
  const reject = async (r) => {
    if (!window.confirm("Reject this time-off request?")) return;

    try {
      await rejectTimeOff(r.userId, r.date);
      alert("Time-off request rejected");
      load();
    } catch (err) {
      alert("Failed to reject time-off request");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>📤 Time Off Requests</h2>

      {loading && <p>Loading...</p>}

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 && !loading && (
            <tr>
              <td colSpan="4" align="center">
                No requests
              </td>
            </tr>
          )}

          {requests.map((r) => (
            <tr key={`${r.userId}-${r.date}`}>
              <td>{r.userId}</td>
              <td>{r.date}</td>
              <td>
                {r.approved === null && "⏳ Pending"}
                {r.approved === true && "✅ Approved"}
                {r.approved === false && "❌ Rejected"}
              </td>
              <td>
                {r.approved === null && (
                  <>
                    <button onClick={() => approve(r)}>Approve</button>
                    <button
                      onClick={() => reject(r)}
                      style={{ marginLeft: 8, color: "crimson" }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimeOffRequestList;
