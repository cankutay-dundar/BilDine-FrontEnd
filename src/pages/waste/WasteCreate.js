import React, { useState } from "react";
import { recordWaste } from "../../api/inventoryApi";

function WasteCreate() {
  const [form, setForm] = useState({
    itemName: "",
    amount: 0,
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    recordWaste(form).then(() => {
      alert("Waste recorded");
      setForm({ itemName: "", amount: 0, date: "" });
    });
  };

  return (
    <div>
      <h2>Record Waste</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <br /><br />
        <button type="submit">Save Waste</button>
      </form>
    </div>
  );
}

export default WasteCreate;
