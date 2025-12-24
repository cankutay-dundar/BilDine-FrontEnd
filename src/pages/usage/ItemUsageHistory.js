import React, { useEffect, useState } from "react";
import { getItemUsageHistory, getAllItems } from "../../api/inventoryApi";

function ItemUsageHistory() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAllItems().then(data => {
      setItems(data);
      if (data.length > 0) setItemName(data[0].itemName);
    });
  }, []);

  const load = async () => {
    const data = await getItemUsageHistory(itemName);
    setRecords(data);
  };

  return (
    <div>
      <h2>Item Usage History</h2>

      <select value={itemName} onChange={e => setItemName(e.target.value)}>
        {items.map(i => (
          <option key={i.itemName} value={i.itemName}>
            {i.itemName}
          </option>
        ))}
      </select>

      <button onClick={load}>Load</button>

      <ul>
        {records.map((r, i) => (
          <li key={i}>
            {r.dateUsed} – {r.usageType} – {r.amountUsed}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemUsageHistory;
