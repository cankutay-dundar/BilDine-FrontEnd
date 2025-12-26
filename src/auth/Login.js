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
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="username"
              placeholder="e.g. John Doe"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
    background: "#0b0e14", // Dark blue background
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    background: "#151b26", // Slightly lighter card
    borderRadius: "8px",
    border: "1px solid #1f2937",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#9ca3af",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: "2px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    color: "#fff",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "6px",
    outline: "none",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "6px",
    color: "#f87171",
    fontSize: "0.9rem",
  },
  errorIcon: {
    fontSize: "1.1rem",
  },
  button: {
    marginTop: "12px",
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#fff",
    background: "#22c55e", // Green button
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    background: "#15803d",
  },
};

export default Login;
