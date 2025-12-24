import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Card({ title, desc, to, emoji }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        width: "100%",
        background: "#fff"
      }}
    >
      <h3 style={{ margin: 0 }}>
        {emoji} {title}
      </h3>
      <p style={{ marginTop: 8, color: "#555" }}>{desc}</p>
      <Link to={to}>Open →</Link>
    </div>
  );
}

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>👷 Staff Dashboard</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Welcome, <b>{user?.fullName}</b>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginTop: 14
        }}
      >
        <Card
          emoji="📅"
          title="Schedule"
          desc="View your weekly regular shifts."
          to="/staff/schedule"
        />
        <Card
          emoji="🕒"
          title="Availability Request"
          desc="Submit or cancel an availability request."
          to="/staff/availability"
        />
        <Card
          emoji="🛑"
          title="Time-Off Request"
          desc="Submit or cancel a time-off request."
          to="/staff/timeoff"
        />
        <Card
          emoji="✅"
          title="Work Hours"
          desc="Check-in and check-out for today."
          to="/staff/work-hours"
        />
      </div>
    </div>
  );
}
