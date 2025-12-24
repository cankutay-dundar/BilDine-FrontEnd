import React, { useState } from "react";
import { getWasteReport } from "../../api/inventoryApi";

function WasteReport() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState({
    start: "",
    end: "",
    date: ""
  });

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const load = () => {
    getWasteReport(filter).then(setRecords);
  };

  return (
    <div>
      <h2>Waste Report</h2>

      <input type="date" name="date" onChange={handleChange} />
      <br />
      <input type="date" name="start" onChange={handleChange} />
      <input type="date" name="end" onChange={handleChange} />
      <br /><br />
      <button onClick={load}>Load</button>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Item</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.itemName}</td>
              <td>{r.dateUsed}</td>
              <td>{r.amountUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WasteReport;
