import { useState } from "react";

interface Props {
  onLogin: (user: { role: "ADMIN" | "DOCTOR"; username: string }) => void;
}


export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then(data => onLogin(data))
      .catch(() => setError("Invalid username or password"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f8"
    }}>
      <div style={{
        width: "320px",
        padding: "30px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Doctor PMS Login</h2>

        <label>Username</label>
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#1976d2",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
