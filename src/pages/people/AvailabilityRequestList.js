import { useEffect, useState } from "react";
import {
  getAvailabilityRequests,
  approveAvailability
} from "../../api/peopleApi";

function AvailabilityRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getAvailabilityRequests();
    console.log("📥 AVAILABILITY REQUESTS:", data);

    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (r) => {
    console.log("✅ APPROVING:", r);

    await approveAvailability(
      r.user_id,
      r.date,
      r.start_time
    );

    alert("Request approved");
    load();
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
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="6" align="center">
                No requests
              </td>
            </tr>
          )}

          {requests.map((r, i) => (
            <tr key={`${r.user_id}-${r.date}-${r.start_time}`}>
              <td>{r.user_id}</td>
              <td>{r.date}</td>
              <td>{r.start_time}</td>
              <td>{r.end_time}</td>
              <td>{r.approved ? "✅" : "❌"}</td>
              <td>
                {!r.approved && (
                  <button onClick={() => approve(r)}>
                    Approve
                  </button>
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
