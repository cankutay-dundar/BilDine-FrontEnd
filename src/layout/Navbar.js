import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: 12,
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        gap: 10
      }}
    >
      <strong>
        {user.fullName} ({user.role})
      </strong>

      <span>|</span>

      {/* MANAGER NAVIGATION */}
      {user.role === "MANAGER" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/items">Items</Link>
          <Link to="/courses">Courses</Link>
    {/* ORDERS */}
    <Link to="/orders/dine-in">Dine-In Order</Link>
    <Link to="/orders/online">Online Order</Link>
    <Link to="/orders/detail">Order Detail</Link>    
    <Link to="/orders/all">All Orders</Link>          
      
    <Link to="/people">People</Link>
          <Link to="/schedule">Schedule</Link>
        </>
      )}

      {/* SHARED */}
      <Link to="/usage/list">Usage</Link>

      <span style={{ marginLeft: "auto" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  );
}

export default Navbar;
