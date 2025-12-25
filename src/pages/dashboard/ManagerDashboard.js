import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../api/orderApi";
import { getAllUsers } from "../../api/peopleApi";

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    onlineOrders: 0,
    dineInOrders: 0,
    totalRevenue: 0,
    staffCount: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const orders = await getAllOrders();
      const users = await getAllUsers();

      const totals = orders.reduce((acc, o) => {
        acc.totalOrders++;
        acc.totalRevenue += Number(o.orderPrice || 0);
        if (o.tableNo != null) acc.dineInOrders++;
        else acc.onlineOrders++;
        return acc;
      }, { totalOrders: 0, onlineOrders: 0, dineInOrders: 0, totalRevenue: 0 });

      setStats({
        ...totals,
        staffCount: users.length
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  const Card = ({ title, value, to }) => (
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          border: "1px solid #333",
          borderRadius: 8,
          padding: 20,
          minWidth: 220,
          background: "#0f172a"
        }}
      >
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </Link>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      <h2>📊 Manager Dashboard</h2>

      {/* ===== STATS ===== */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 40
        }}
      >
        <Card title="Total Orders" value={stats.totalOrders} to="/orders/all" />
        <Card title="Online Orders" value={stats.onlineOrders} to="/orders/online" />
        <Card title="Dine-In Orders" value={stats.dineInOrders} to="/orders/dine-in" />
        <Card title="Total Revenue" value={`${stats.totalRevenue} ₺`} to="/orders/all" />
        <Card title="Staff Count" value={stats.staffCount} to="/people" />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <h3>⚡ Quick Actions</h3>

      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        <Link to="/items"><button>📦 Items</button></Link>
        <Link to="/courses"><button>🍽️ Courses</button></Link>
        <Link to="/orders/dine-in"><button>🍴 Dine-In Orders</button></Link>
        <Link to="/orders/online"><button>🚚 Online Orders</button></Link>
        <Link to="/orders/all"><button>📋 All Orders</button></Link>
        <Link to="/people"><button>👥 People</button></Link>
        <Link to="/usage/list"><button>📊 Usage</button></Link>
        <Link to="/usage/list"><button>🗑️ Waste Report</button></Link>
      </div>
    </div>
  );
}

export default Dashboard;
