import { useEffect, useState } from "react";
import { getOrderById } from "../../api/orderApi";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const MAX_ID = 500;

  const loadAllOrders = async () => {
    setLoading(true);
    const results = [];

    for (let id = 1; id <= MAX_ID; id++) {
      try {
        const order = await getOrderById(id);
        if (order) {
          results.push(order);
        }
      } catch {

      }
    }

    setOrders(results);
    setLoading(false);
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const renderType = (o) =>
    o.tableNo != null ? "🍽️ Dine-In" : "🚚 Online";

  const renderDetails = (o) =>
    o.tableNo != null ? `Table ${o.tableNo}` : o.address || "-";

  const renderCourses = (o) => {
    const map = o.courses || o.orderCourses;
    if (!map || Object.keys(map).length === 0) return "-";

    return Object.entries(map).map(([c, q]) => (
      <div key={c}>{c} × {q}</div>
    ));
  };

  return (
    <div style={{ maxWidth: 1300 }}>
      <h2>📦 All Orders (Online + Dine-In)</h2>

      {loading && <p>Loading…</p>}

      {!loading && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {orders.length > 0 && (
        <table border="1" width="100%" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Details</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Time</th>
              <th>Deliverer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{renderType(o)}</td>
                <td>{renderDetails(o)}</td>
                <td>{renderCourses(o)}</td>
                <td>{o.status}</td>
                <td>{o.orderPrice} ₺</td>
                <td>{o.date}</td>
                <td>{o.time}</td>
                <td>{o.delivererId ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllOrders;
