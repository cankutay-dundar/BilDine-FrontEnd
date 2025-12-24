import React, { useEffect, useState } from "react";
import { getAllItems, deleteItem, getLowStockAlerts } from "../../api/inventoryApi";
import { Link } from "react-router-dom";

function ItemList() {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const loadData = async () => {
    const itemsData = await getAllItems();
    setItems(itemsData);

    try {
      const alertsData = await getLowStockAlerts();
      setAlerts(alertsData);
    } catch (err) {
      console.error("Failed to load alerts", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (name) => {
    if (window.confirm("Are you sure?")) {
      deleteItem(name).then(() => {
        loadData(); // ✅ refresh without page reload
      });
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <Link to="/items/create">➕ Add Item</Link>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Amount</th>
            <th>Meat</th>
            <th>Gluten</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const hasAlert = alerts.some(a => a.itemName === item.name);
            return (
              <tr
                key={item.name}
                style={hasAlert ? { backgroundColor: "#374151", color: "#f9fafb" } : {}}
              >
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td style={hasAlert ? { color: "#f87171", fontWeight: "bold" } : {}}>
                  {item.amount}
                  {hasAlert && (
                    <span style={{ marginLeft: 8, fontSize: "0.85em" }}>
                      ⚠️ Low Stock
                    </span>
                  )}
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <Link to={`/items/edit/${item.name}`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(item.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
