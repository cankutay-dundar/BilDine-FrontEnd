import { useEffect, useState } from "react";
import {
  getTimeOffRequests,
  approveTimeOff,
  rejectTimeOff
} from "../../api/peopleApi";

function TimeOffRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(new Set()); // Track pending actions by ID

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTimeOffRequests();
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

  const getRecordId = (r) => `${r.userId}-${r.date}`;

  const approve = async (r) => {
    const id = getRecordId(r);
    setProcessing((prev) => new Set(prev).add(id));

    try {
      await approveTimeOff(r.userId, r.date);
      // Optimistically update or reload
      setRequests(prev => prev.map(req =>
        getRecordId(req) === id ? { ...req, approved: true } : req
      ));
    } catch (err) {
      alert("Failed to approve time-off request");
      console.error(err);
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const reject = async (r) => {
    if (!window.confirm("Reject this time-off request?")) return;

    const id = getRecordId(r);
    setProcessing((prev) => new Set(prev).add(id));

    try {
      await rejectTimeOff(r.userId, r.date);
      setRequests(prev => prev.map(req =>
        getRecordId(req) === id ? { ...req, approved: false } : req
      ));
    } catch (err) {
      alert("Failed to reject time-off request");
      console.error(err);
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span>📤</span> Time Off Requests
      </h2>

      {loading && <p>Loading requests...</p>}

      {!loading && (
        <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden", background: "#1e1e1e" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#ddd" }}>
            <thead>
              <tr style={{ background: "#2c2c2c", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>User ID</th>
                <th style={{ padding: "12px 16px", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>Date</th>
                <th style={{ padding: "12px 16px", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>Status</th>
                <th style={{ padding: "12px 16px", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="4" align="center" style={{ padding: 20, color: "#777" }}>
                    No pending requests
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const id = getRecordId(r);
                  const isProcessing = processing.has(id);
                  const isPending = r.approved === null;

                  return (
                    <tr key={id} style={{ borderTop: "1px solid #333" }}>
                      <td style={{ padding: "12px 16px" }}>{r.userId}</td>
                      <td style={{ padding: "12px 16px" }}>{r.date}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {r.approved === null && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>⏳ Pending</span>}
                        {r.approved === true && <span style={{ color: "#2ecc71" }}>✅ Approved</span>}
                        {r.approved === false && <span style={{ color: "#e74c3c" }}>❌ Rejected</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {isPending ? (
                          <div style={{ display: "flex", gap: 10 }}>
                            <button
                              onClick={() => approve(r)}
                              disabled={isProcessing}
                              style={{
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: 4,
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                backgroundColor: isProcessing ? "#555" : "#2ecc71",
                                color: "#fff",
                                fontWeight: "bold",
                                opacity: isProcessing ? 0.6 : 1
                              }}
                            >
                              {isProcessing ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => reject(r)}
                              disabled={isProcessing}
                              style={{
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: 4,
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                backgroundColor: isProcessing ? "#555" : "#e74c3c",
                                color: "#fff",
                                fontWeight: "bold",
                                opacity: isProcessing ? 0.6 : 1
                              }}
                            >
                              {isProcessing ? "Processing..." : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#777", fontSize: "0.9rem" }}>Completed</span>
                        )}
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

export default TimeOffRequestList;
