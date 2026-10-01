import { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Sun,
  Moon,
  ArrowRight,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { authApi } from "../../api/auth";

export default function LoginView({ onLogin, theme, toggleTheme }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await authApi.register({ name, email, password });
        const userData = await authApi.login({ email, password });
        onLogin(userData);
      } else {
        const data = await authApi.login({ email, password });
        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="login-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="login-card">
        <div className="login-visual">
          <div>
            <div className="login-logo-icon">
              {isRegister ? (
                <UserPlus size={24} color="white" />
              ) : (
                <Lock size={24} color="white" />
              )}
            </div>

            <h1 className="login-title">TaskFlow</h1>

            <p className="login-subtitle">
              {isRegister
                ? "Create your free account and start organizing your tasks, notes, and goals today."
                : "Manage your professional life with precision. Tasks, Notes, and Goals in one unified workspace."}
            </p>
          </div>

          <div className="login-copyright">© 2026 TaskFlow Inc.</div>
        </div>

        <div className="login-form-section">
          <h2 className="form-title">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="form-description">
            {isRegister
              ? "Fill in your details to get started."
              : "Enter your credentials to access your account."}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="input-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <User size={18} className="input-icon" />

                  <input
                    type="text"
                    className="modern-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />

                <input
                  type="email"
                  className="modern-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="modern-input"
                  placeholder={isRegister ? "Min. 6 characters" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={isRegister ? 6 : undefined}
                  required
                  style={{ paddingRight: "45px" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    zIndex: 2,
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                "Please wait..."
              ) : isRegister ? (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="form-toggle-text">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={toggleMode} className="form-toggle-link">
              {isRegister ? "Sign in" : "Create one"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
