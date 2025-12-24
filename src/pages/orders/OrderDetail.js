import { useState } from "react";
import { getOrderById } from "../../api/orderApi";

function OrderDetail() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const load = async () => {
    const data = await getOrderById(orderId);
    setOrder(data);
  };

  return (
    <div>
      <h2>Order Detail</h2>

      <input
        placeholder="Order ID"
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
      />
      <button onClick={load}>Load</button>

      {order && (
        <>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total:</b> {order.orderPrice} ₺</p>
          <p><b>Date:</b> {order.date}</p>
          <p><b>Time:</b> {order.time}</p>
        </>
      )}
    </div>
  );
}

export default OrderDetail;
