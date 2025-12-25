import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { getAllUsers, verifyUser, getUserKindByUserId } from "../api/peopleApi"; 
// 👆 adjust the import path to wherever your API file is

function normalizeName(s) {
  return (s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === "MANAGER" ? "/dashboard" : "/staff", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const nameKey = normalizeName(fullName);

      const users = await getAllUsers();
      const matched = users.find((u) => normalizeName(u.fullName) === nameKey);

      if (!matched) {
        setError("User not found.");
        return;
      }

      const ok = await verifyUser(matched.id, password); // returns boolean
      if (!ok) {
        setError("Invalid password.");
        return;
      }

      // Determine role/kind from backend (so user can’t pick MANAGER from UI)
      const kindRes = await getUserKindByUserId(matched.id);

      // handle both possible shapes: "MANAGER" or { kind: "MANAGER" }
      const kind =
        typeof kindRes === "string"
          ? kindRes
          : (kindRes?.kind ?? kindRes?.role ?? "");

      const role = kind === "MANAGER" ? "MANAGER" : "STAFF";

      // Keep your AuthContext API: login(fullName, role, userId)
      login(matched.fullName, role, Number(matched.id));
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="username"
              style={{ color: '#222', background: '#fff' }}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ color: '#222', background: '#fff' }}
            />
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
    alignItems: "center",
  },
  card: {
    width: 340,
    padding: 24,
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 8,
  },
  error: {
    marginBottom: 12,
    color: "crimson",
    fontSize: 14,
  },
};

export default Login;
