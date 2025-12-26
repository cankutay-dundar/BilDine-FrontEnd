import { useEffect, useState } from "react";

function UsageCreate() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [usageType, setUsageType] = useState("USE");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/inventory/items")
      .then(res => res.json())
      .then(data => {
        console.log("📥 ITEMS RESPONSE:", data);

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setItemName(data[0].name);
        } else {
          setItems([]);
          setItemName("");
        }
      })
      .catch(err => {
        console.error("❌ ITEMS FETCH ERROR:", err);
        setItems([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!itemName) {
      setMessage("❌ Please select an item");
      return;
    }

    const payload = {
      itemName: itemName,
      usageType,
      amount: Number(amount)
    };

    if (date) payload.date = date;

    console.log("📤 USAGE PAYLOAD:", payload);

    try {
      const res = await fetch("/api/inventory/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      console.log("📥 RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      console.log("📥 PARSED RESPONSE:", data);

      if (!res.ok) {
        console.error("❌ SERVER ERROR:", data);
        setMessage("❌ " + (data.error || "Internal Server Error"));
        return;
      }

      setMessage("✅ Usage recorded successfully");
      setAmount("");
      setDate("");

    } catch (err) {
      console.error("❌ NETWORK ERROR:", err);
      setMessage("❌ Network error");
    }
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Record Usage</h2>

      <form onSubmit={handleSubmit}>
        {/* ITEM */}
        <label>Item</label><br />
        <select
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          required
        >
          {items.length === 0 && (
            <option value="">No items available</option>
          )}

          {items.map((item, index) => (
            <option key={`${item.name}-${index}`} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* TYPE */}
        <label>Usage Type</label><br />
        <select
          value={usageType}
          onChange={e => setUsageType(e.target.value)}
        >
          <option value="USE">USE</option>
          <option value="WASTE">WASTE</option>
          <option value="RECEIVE">RECEIVE</option>
        </select>

        <br /><br />

        {/* AMOUNT */}
        <label>Amount</label><br />
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />

        <br /><br />

        {/* DATE */}
        <label>Date (optional)</label><br />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default UsageCreate;
