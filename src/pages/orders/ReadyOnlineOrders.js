import { useEffect, useState } from "react";
import { getReadyOnlineOrders, claimOrder } from "../../api/orderApi";

function ReadyOnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [courierId, setCourierId] = useState("");

  useEffect(() => {
    getReadyOnlineOrders().then(setOrders);
  }, []);

  const claim = async (orderId) => {
    await claimOrder(orderId, Number(courierId));
    alert("Order claimed");
  };

  return (
    <div>
      <h2>Ready Online Orders</h2>

      <input placeholder="Courier ID"
        value={courierId}
        onChange={e => setCourierId(e.target.value)} />

      <ul>
        {orders.map(o => (
          <li key={o.orderId}>
            #{o.orderId} – {o.address}
            <button onClick={() => claim(o.orderId)}>Claim</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReadyOnlineOrders;
