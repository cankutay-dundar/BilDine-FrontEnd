import React, { useState } from "react";
import { getItemWasteTotal } from "../../api/inventoryApi";

function ItemWasteTotal() {
  const [itemName, setItemName] = useState("");
  const [total, setTotal] = useState(null);

  const load = () => {
    getItemWasteTotal(itemName).then(res => setTotal(res.totalWaste));
  };

  return (
    <div>
      <h2>Item Waste Total</h2>

      <input
        placeholder="Item Name"
        onChange={e => setItemName(e.target.value)}
      />
      <button onClick={load}>Check</button>

      {total !== null && (
        <p>Total Waste: {total}</p>
      )}
    </div>
  );
}

export default ItemWasteTotal;
