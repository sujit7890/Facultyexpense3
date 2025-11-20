// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mitLogo from "../asset/MITADTU.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin credential path
    if (email === "admin@123" && password === "admin123") {
      toast.success("Welcome, Admin!", { autoClose: 1200 });
      // allow the toast to show briefly then navigate
      setTimeout(() => navigate("/admin"), 700);
      return;
    }

    // Simple 'any valid credential' path
    if (email && password) {
      const userData = {
        name: "",
        email,
        department: "XYZ",
        phone: "+91 XXXXXXXXXX",
      };
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch {
        // ignore localStorage errors silently
      }

      toast.success("Login successful", { autoClose: 1200 });
      setTimeout(() => navigate("/home"), 700);
      return;
    }

    // Validation feedback
    toast.error("Please enter your email and password", { autoClose: 1600 });
  };

  return (
    <>
      <style>{`
        /* Page background */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background: radial-gradient(1200px 400px at 10% 10%, rgba(99,102,241,0.06), transparent 10%),
                      linear-gradient(120deg, #f3f7ff 0%, #ffffff 60%);
          -webkit-font-smoothing: antialiased;
        }

        /* Card */
        .login-card {
          width: 460px;
          max-width: 96%;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(6px);
          border-radius: 16px;
          padding: 36px 32px;
          box-shadow: 0 18px 50px rgba(2,6,23,0.08);
          border: 1px solid rgba(10,20,40,0.04);
          text-align: center;
          animation: cardIn 420ms cubic-bezier(.2,.9,.3,1);
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .login-logo {
          width: 110px;
          height: auto;
          margin-bottom: 12px;
        }

        .login-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0b1220;
          margin-bottom: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d9e6fb;
          background: #fbfdff;
          font-size: 1rem;
          transition: box-shadow .18s ease, border-color .18s ease, transform .18s;
        }

        .login-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 10px 24px rgba(37,99,235,0.08);
          transform: translateY(-1px);
        }

        .login-btn {
          margin-top: 6px;
          padding: 12px 14px;
          border-radius: 10px;
          background: linear-gradient(90deg,#2563eb,#7c3aed);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 12px 34px rgba(37,99,235,0.12);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 48px rgba(37,99,235,0.18);
        }

        .helper-row {
          display:flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          color: #475569;
          font-size: 0.92rem;
        }

        .forgot {
          color: #2563eb;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .login-card { padding: 26px 20px; }
          .login-title { font-size: 1.15rem; }
          .login-logo { width: 90px; }
        }
      `}</style>

      <div className="login-page" role="main">
        <div className="login-card" aria-labelledby="login-heading">
          <img src={mitLogo} alt="MIT ADT Logo" className="login-logo" />
          <h1 id="login-heading" className="login-title">Faculty Expense Management</h1>

          <form onSubmit={handleLogin} className="login-form" aria-label="Login form">
            <input
              type="email"
              placeholder="Enter your MIT email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />

            <input
              type="password"
              placeholder="Enter password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />

            <div className="helper-row" aria-hidden>
              <div style={{ fontSize: 12, color: "#64748b" }}>Use your institute credentials</div>
              <div
                className="forgot"
                role="button"
                tabIndex={0}
                onClick={() => toast.info('Contact IT support at it-support@mit.edu', { autoClose: 2200 })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toast.info('Contact IT support at it-support@mit.edu', { autoClose: 2200 }); }}
              >
                Need help?
              </div>
            </div>

            <button type="submit" className="login-btn" aria-label="Login">Login</button>
          </form>

          {/* non-blocking notifications */}
          <ToastContainer position="top-center" autoClose={1400} hideProgressBar={false} newestOnTop />
        </div>
      </div>
    </>
  );
}

export default Login;
