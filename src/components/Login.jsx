import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

import mitLogo from "../asset/MITADTU.png";
import "./styles/Login.css";

const auth = getAuth(app);
const db = getFirestore(app);

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // 🔐 1. Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 🔎 2. Get role from Firestore
      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        toast.error("User role not found. Contact admin.");
        setLoading(false);
        return;
      }

      
      const role = snap.data()?.role?.trim().toLowerCase();

      toast.success("Login successful");

     
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 700);

    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page" role="main">
        <div className="login-card" aria-labelledby="login-heading">
          <img src={mitLogo} alt="MIT ADT Logo" className="login-logo" />

          <h1 id="login-heading" className="login-title">
            Faculty Expense Management
          </h1>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Enter your MIT email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="helper-row">
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Use your institute credentials
              </div>
              <div
                className="forgot"
                onClick={() =>
                  toast.info("Contact IT support at it-support@mit.edu.in")
                }
              >
                Need help?
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <ToastContainer position="top-center" autoClose={1500} />
        </div>
      </div>
    </>
  );
}

export default Login;
