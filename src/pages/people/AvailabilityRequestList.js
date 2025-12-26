import { useEffect, useState } from "react";
import {
  getAvailabilityRequests,
  approveAvailability,
  rejectAvailability
} from "../../api/peopleApi";

function AvailabilityRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAvailabilityRequests();
      console.log("📥 AVAILABILITY REQUESTS:", data);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (r) => {
    try {
      await approveAvailability(
        r.userId,
        r.date,
        r.startTime,
        r.endTime
      );
      alert("Request approved");
      load();
    } catch (err) {
      alert("Failed to approve request");
      console.error(err);
    }
  };

  const reject = async (r) => {
    if (!window.confirm("Reject this availability request?")) return;

    try {
      await rejectAvailability(
        r.userId,
        r.date,
        r.startTime,
        r.endTime
      );
      alert("Request rejected");
      load();
    } catch (err) {
      alert("Failed to reject request");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>📥 Availability Requests</h2>

      {loading && <p>Loading...</p>}

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 && !loading && (
            <tr>
              <td colSpan="6" align="center">
                No requests
              </td>
            </tr>
          )}

          {requests.map((r) => (
            <tr key={`${r.userId}-${r.date}-${r.startTime}`}>
              <td>{r.userId}</td>
              <td>{r.date}</td>
              <td>{r.startTime}</td>
              <td>{r.endTime}</td>
              <td>
                {r.approved === null && "⏳ Pending"}
                {r.approved === true && "✅ Approved"}
                {r.approved === false && "❌ Rejected"}
              </td>
              <td>
                {r.approved === null && (
                  <>
                    <button onClick={() => approve(r)}>
                      Approve
                    </button>

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

export default AvailabilityRequestsList;
