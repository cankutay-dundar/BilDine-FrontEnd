import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function StaffNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "STAFF") return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: 12,
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: 12
      }}
    >
      <strong>👷 {user.fullName} (STAFF)</strong>

      <Link to="/staff">Dashboard</Link>
      <Link to="/staff/schedule">Schedule</Link>
      <Link to="/staff/availability">Availability</Link>
      <Link to="/staff/timeoff">Time-Off</Link>
      <Link to="/staff/work-hours">Work Hours</Link>

      <span style={{ marginLeft: "auto" }}>
        <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  );
}

export default StaffNavbar;
