import React, { useEffect, useState } from "react";
import { updateItem, getAllItems } from "../../api/inventoryApi";
import { useParams, useNavigate } from "react-router-dom";

function ItemEdit() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getAllItems().then(items => {
      const found = items.find(i => i.name === name); // ✅ DOĞRU
      setForm(found);
    });
  }, [name]);

  if (!form) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      price: form.price,
      amount: form.amount,
      containsMeat: form.containsMeat,
      containsGluten: form.containsGluten
    };

    await updateItem(form.name, payload);
    navigate("/items");
  };

  return (
    <div>
      <h2>Edit Item: {form.name}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
        />
        <br />

        <input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default ItemEdit;
