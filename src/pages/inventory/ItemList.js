import React, { useEffect, useState } from "react";
import { getAllItems, deleteItem } from "../../api/inventoryApi";
import { Link } from "react-router-dom";

function ItemList() {
  const [items, setItems] = useState([]);

  const loadItems = () => {
    getAllItems().then(setItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (name) => {
    if (window.confirm("Are you sure?")) {
      deleteItem(name).then(() => {
        loadItems(); // ✅ refresh without page reload
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
          {items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.amount}</td>
              <td>-</td>
              <td>-</td>
              <td>
                <Link to={`/items/edit/${item.name}`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(item.name)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
