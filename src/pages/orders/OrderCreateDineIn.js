import { useEffect, useState } from "react";
import { createDineInOrder, getOrderById, getDineInOrders } from "../../api/orderApi";
import { getAllWaiters } from "../../api/peopleApi";
import { getAllCourses } from "../../api/inventoryApi";

function OrderCreateDineIn() {
  /* ================= DATA ================= */
  const [users, setUsers] = useState([]);
  const [coursesList, setCoursesList] = useState([]);

  /* ================= FORM ================= */
  const [waiterId, setWaiterId] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [courses, setCourses] = useState({});

  /* ================= ORDERS ================= */
  const [dineInOrders, setDineInOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    getAllWaiters().then(setUsers);
    getAllCourses().then(setCoursesList);
    loadDineInOrders();
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
  const calculateTotalPrice = (courses) => {
    let total = 0;

    for (const [courseName, qty] of Object.entries(courses)) {
      const course = coursesList.find(c => c.courseName === courseName);
      if (course) {
        total += course.price * qty;
      }
    }

    return total;
  };

  /* ================= CREATE ORDER ================= */
  const submit = async () => {
    if (!waiterId || !tableNo || Object.keys(courses).length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const orderId = await createDineInOrder(
        Number(waiterId),
        Number(tableNo),
        courses
      );

      const totalPrice = calculateTotalPrice(courses);

      const newOrder = {
        orderId,
        tableNo: Number(tableNo),
        status: "RECEIVED",
        orderPrice: totalPrice,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        delivererId: Number(waiterId),
        courses: { ...courses }
      };


      setDineInOrders(prev => [newOrder, ...prev]);

      setCourses({});
      setTableNo("");
      alert("Order created (ID: " + orderId + ")");

    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    }
  };


  /* ================= LOAD ORDERS ================= */
  const loadDineInOrders = async () => {
    setLoading(true);
    try {
      const results = await getDineInOrders();
      setDineInOrders(results);
    } catch (err) {
      console.error("Failed to load dine-in orders:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FRONTEND MAGIC ================= */
  // Create an O(1) map for quick waiter name lookups
  const waiterMap = new Map(users.map(u => [u.id, u.fullName]));

  const waiters = users;

  const getWaiterName = (id) => waiterMap.get(id) || `ID ${id}`;

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2>🍽️ Create Dine-In Order</h2>

      {/* ===== FORM ===== */}
      <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 20 }}>
        <label>Waiter</label><br />
        <select value={waiterId} onChange={e => setWaiterId(e.target.value)}>
          <option value="">Select Waiter</option>
          {waiters.map(w => (
            <option key={w.id} value={w.id}>
              {w.fullName}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Table No</label><br />
        <input
          type="number"
          min="1"
          value={tableNo}
          onChange={e => setTableNo(e.target.value)}
        />

        <br /><br />

        <label>Add Course</label><br />
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
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

        <button onClick={addCourse} style={{ marginLeft: 6 }}>
          Add
        </button>

        {Object.keys(courses).length > 0 && (
          <ul>
            {Object.entries(courses).map(([c, q]) => (
              <li key={c}>{c} × {q}</li>
            ))}
          </ul>
        )}

        <button onClick={submit}>Create Order</button>
      </div>

      {/* ===== ORDERS ===== */}
      <h3>📋 Dine-In Orders</h3>

      {loading && <p>Loading…</p>}

      {dineInOrders.length > 0 && (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Table</th>
              <th>Status</th>
              <th>Total</th>
              <th>Order Details</th>
              <th>Waiter</th>
            </tr>
          </thead>
          <tbody>
            {dineInOrders.map(o => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{o.tableNo}</td>
                <td>{o.status}</td>
                <td>{o.orderPrice} ₺</td>
                <td>
                  {o.courses
                    ? Object.entries(o.courses).map(([c, q]) => (
                      <div key={c}>
                        🍴 {c} × {q}
                      </div>
                    ))
                    : "-"}
                </td>
                <td>{getWaiterName(o.delivererId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderCreateDineIn;
