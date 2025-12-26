import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../api/orderApi";

export default function UserOnlineOrderStatus() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    const load = async () => {
        try {
            setErr("");
            const res = await getOrderDetails(Number(id));
            setData(res);
        } catch (e) {
            setErr("Could not load order. Check order id.");
        }
    };

    useEffect(() => {
        load();
        const t = setInterval(load, 4000);
        return () => clearInterval(t);
    }, [id]);

    if (err) return <div style={{ padding: 16 }}>{err}</div>;
    if (!data) return <div style={{ padding: 16 }}>Loading...</div>;

    const { order, courses } = data;

    return (
        <div style={{ padding: 16 }}>
            <h2>Order #{order.orderId}</h2>
            <p><b>Status:</b> {order.status}</p>

            <h3>Items</h3>
            <ul>
                {Object.entries(courses || {}).map(([name, qty]) => (
                    <li key={name}>{name} × {qty}</li>
                ))}
            </ul>
        </div>
    );
}
