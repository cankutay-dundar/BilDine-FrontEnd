import React, { useEffect, useState } from "react";
import { getLowStockItems } from "../../api/inventoryApi";

function LowStockItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getLowStockItems(10).then(setItems);
  }, []);

  return (
    <div>
      <h2>Low Stock Items</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.item_name}>
              <td>{item.item_name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowStockItems;
