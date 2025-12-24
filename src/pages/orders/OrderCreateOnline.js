import { useEffect, useState } from "react";
import {
  createOnlineOrder,
  getOrderById,
  moveToPreparing,
  moveToReady
} from "../../api/orderApi";
import { getAllCourses } from "../../api/inventoryApi";

const STATUS_LIST = ["RECEIVED", "PREPARING", "READY", "DELIVERED"];

function OrderCreateOnline() {
  /* ================= DATA ================= */
  const [coursesList, setCoursesList] = useState([]);

  /* ================= CREATE FORM ================= */
  const [onlineCustomerId, setOnlineCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [courses, setCourses] = useState({});

  /* ================= ORDERS ================= */
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= EDIT ================= */
  const [editingId, setEditingId] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    getAllCourses().then(setCoursesList);
    loadOnlineOrders();
  }, []);

  /* ================= ADD COURSE ================= */
  const addCourse = () => {
    if (!selectedCourse || quantity <= 0) return;

    setCourses(prev => ({
      ...prev,
      [selectedCourse]: (prev[selectedCourse] || 0) + Number(quantity)
    }));

    setSelectedCourse("");
    setQuantity(1);
  };

  /* ================= CREATE ORDER ================= */
  const submit = async () => {
    if (!address || !phone || Object.keys(courses).length === 0) {
      alert("Address, phone and courses required");
      return;
    }

    await createOnlineOrder(
      onlineCustomerId ? Number(onlineCustomerId) : null,
      address,
      phone,
      courses
    );

    setOnlineCustomerId("");
    setAddress("");
    setPhone("");
    setCourses({});
    loadOnlineOrders();
  };

  /* ================= LOAD ORDERS ================= */
  const loadOnlineOrders = async () => {
    setLoading(true);
    const results = [];

    for (let id = 1; id <= 300; id++) {
      try {
        const order = await getOrderById(id);
        if (order && order.tableNo == null) results.push(order);
      } catch {}
    }

    setOnlineOrders(results);
    setLoading(false);
  };

  /* ================= HELPERS ================= */
  const renderCourses = (order) => {
    const map = order.courses || order.orderCourses || {};
    if (Object.keys(map).length === 0) return "-";

    return Object.entries(map).map(([name, qty]) => (
      <div key={name}>
        {name} × {qty}
      </div>
    ));
  };

  const startEdit = (o) => {
    setEditingId(o.orderId);
    setEditAddress(o.address || "");
    setEditPhone(o.phone || "");
    setEditStatus(o.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (o) => {
    try {
      // STATUS FLOW
      if (editStatus !== o.status) {
        if (editStatus === "PREPARING") await moveToPreparing(o.orderId);
        if (editStatus === "READY") await moveToReady(o.orderId);
      }

      alert("Order updated");
      cancelEdit();
      loadOnlineOrders();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: 1200 }}>
      <h2>🚚 Online Orders</h2>

      {/* ===== CREATE FORM ===== */}
      <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 20 }}>
        <h4>Create Online Order</h4>

        <input
          placeholder="Customer ID (optional)"
          value={onlineCustomerId}
          onChange={e => setOnlineCustomerId(e.target.value)}
        /><br /><br />

        <input
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={{ width: "100%" }}
        /><br /><br />

        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        /><br /><br />

        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {coursesList.map(c => (
            <option key={c.courseName} value={c.courseName}>
              {c.courseName}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{ width: 60, marginLeft: 6 }}
        />

        <button onClick={addCourse}>Add</button>

        {Object.keys(courses).length > 0 && (
          <ul>
            {Object.entries(courses).map(([n, q]) => (
              <li key={n}>{n} × {q}</li>
            ))}
          </ul>
        )}

        <button onClick={submit}>Create Order</button>
      </div>

      {/* ===== ORDERS TABLE ===== */}
      <h3>📦 Online Orders</h3>

      {loading && <p>Loading…</p>}

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Courses</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th>Time</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {onlineOrders.map(o => (
            <tr key={o.orderId}>
              <td>{o.orderId}</td>
              <td>{o.onlineCustomerId ? `Customer #${o.onlineCustomerId}` : "Guest"}</td>

              <td>
                {editingId === o.orderId
                  ? <input value={editAddress} onChange={e => setEditAddress(e.target.value)} />
                  : o.address}
              </td>

              <td>
                {editingId === o.orderId
                  ? <input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                  : o.phone}
              </td>

              <td>{renderCourses(o)}</td>

              <td>
                {editingId === o.orderId ? (
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                    {STATUS_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  o.status
                )}
              </td>

              <td>{o.orderPrice} ₺</td>
              <td>{o.date}</td>
              <td>{o.time}</td>

              <td>
                {editingId === o.orderId ? (
                  <>
                    <button onClick={() => saveEdit(o)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(o)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderCreateOnline;
