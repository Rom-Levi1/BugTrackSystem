import { useState } from "react";
import { Bug, Lock, Mail } from "lucide-react";
import { loginUser, registerUser, saveToken } from "../api/bugtrackApi";

function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result =
        mode === "login"
          ? await loginUser(email, password)
          : await registerUser(email, password);

      saveToken(result.access_token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Bug size={30} />
          </div>
          <div>
            <h1>BugTrack</h1>
            <p>Crash and bug monitoring for Android apps</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>

          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              placeholder="developer@example.com"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login to Dashboard"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;