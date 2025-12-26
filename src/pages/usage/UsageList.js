import React, { useState, useEffect } from "react";
import { getAllUsage } from "../../api/inventoryApi";
import { Link } from "react-router-dom";

function UsageList() {
  const [records, setRecords] = useState([]);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    console.log("🔄 LOAD CLICKED | type =", type, "start =", startDate, "end =", endDate);
    setLoading(true);
    setError("");

    try {
      const data = await getAllUsage({ type, start: startDate, end: endDate });

      console.log("📥 DATA FROM API:", data);

      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        console.error("❌ NOT ARRAY:", data);
        setRecords([]);
      }
    } catch (err) {
      console.error("❌ LOAD ERROR:", err);
      setRecords([]);
      setError("Failed to load usage records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Usage Records</h2>

      <div style={{ marginBottom: 15 }}>
        <Link to="/usage/create">
          <button style={{ marginRight: 10 }}>➕ Add Usage</button>
        </Link>

        {/* Type Filter */}
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="">ALL</option>
          <option value="USE">USE</option>
          <option value="WASTE">WASTE</option>
          <option value="RECEIVE">RECEIVE</option>
        </select>

        {/* Date Filters */}
        <label style={{ marginRight: 10 }}>
          Start:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>
        <label style={{ marginRight: 10 }}>
          End:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>

        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Item</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {!loading && records.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}

          {records.map((r, i) => (
            <tr key={`${r.itemName}-${r.dateUsed}-${i}`}>
              <td>{r.itemName}</td>
              <td>{r.dateUsed}</td>
              <td>{r.usageType}</td>
              <td>{r.amountUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsageList;
