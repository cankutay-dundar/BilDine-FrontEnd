import React, { useState } from "react";
import { createItem } from "../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

function ItemCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    amount: "",
    containsMeat: false,
    containsGluten: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🟡 RAW FORM:", form);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      amount: Number(form.amount),
      containsMeat: form.containsMeat,
      containsGluten: form.containsGluten
    };

    console.log("🟠 PAYLOAD TO BACKEND:", payload);

    try {
      await createItem(payload);
      navigate("/items");
    } catch (err) {
      console.error("🔴 CREATE ITEM ERROR:", err);
      alert("Item could not be created");
    }
  };

  return (
    <div>
      <h2>Create Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <br />

        <label>
          <input
            type="checkbox"
            name="containsMeat"
            checked={form.containsMeat}
            onChange={handleChange}
          />
          Contains Meat
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            name="containsGluten"
            checked={form.containsGluten}
            onChange={handleChange}
          />
          Contains Gluten
        </label>

        <br /><br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ItemCreate;
