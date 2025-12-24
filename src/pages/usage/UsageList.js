import React, { useState } from "react";
import { getAllUsage } from "../../api/inventoryApi";
import { Link } from "react-router-dom";

function UsageList() {
  const [records, setRecords] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    console.log("🔄 LOAD CLICKED | type =", type);
    setLoading(true);

    try {
      const data = await getAllUsage(type);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Usage Records</h2>

      <div style={{ marginBottom: 15 }}>
        <Link to="/usage/create">
          <button style={{ marginRight: 10 }}>➕ Add Usage</button>
        </Link>

        <select
          value={type}
          onChange={e => {
            console.log("🔁 TYPE CHANGED:", e.target.value);
            setType(e.target.value);
          }}
          style={{ marginRight: 10 }}
        >
          <option value="">ALL</option>
          <option value="USE">USE</option>
          <option value="WASTE">WASTE</option>
          <option value="RECEIVE">RECEIVE</option>
        </select>

        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

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
