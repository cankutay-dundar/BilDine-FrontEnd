import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Login() {
  // ✅ TÜM HOOK’LAR EN ÜSTTE
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("STAFF");

  // 🔁 Login olmuşsa yönlendir
  useEffect(() => {
    if (user) {
      navigate(user.role === "MANAGER" ? "/dashboard" : "/staff", {
        replace: true
      });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(fullName, role, Number(userId));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>BilDine Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Full Name</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label>User ID</label>
            <input
              type="number"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 340,
    padding: 24,
    border: "1px solid #ccc",
    borderRadius: 6
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12
  },
  button: {
    width: "100%",
    padding: 8
  }
};

export default Login;
