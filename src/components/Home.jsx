import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mitLogo from "../asset/MITADTU.png";
import "./styles/Home.css";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

const db = getFirestore(app);

export default function Home() {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);
  const [unsettledCount, setUnsettledCount] = useState(0);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  const uid = user?.uid; 

  const initials = user?.name
    ? user.name
        .split(" ")
        .map(p => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FB";

  
  useEffect(() => {
    if (!uid) return;

    const fetchCounts = async () => {
      try {
        
        const pendingAppsSnap = await getDocs(
          query(
            collection(db, "advance_applications"),
            where("uid", "==", uid),
            where("status", "==", "pending")
          )
        );

       
        const pendingSettlementsSnap = await getDocs(
          query(
            collection(db, "advance_settlements"),
            where("uid", "==", uid),
            where("status", "==", "pending")
          )
        );

        setPendingCount(
          pendingAppsSnap.size + pendingSettlementsSnap.size
        );

        const approvedAppsSnap = await getDocs(
          query(
            collection(db, "advance_applications"),
            where("uid", "==", uid),
            where("status", "==", "approved")
          )
        );

        const settledSnap = await getDocs(
          query(
            collection(db, "advance_settlements"),
            where("uid", "==", uid)
          )
        );

        setUnsettledCount(
          Math.max(approvedAppsSnap.size - settledSnap.size, 0)
        );
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, [uid]);

  const handleAction = (key) => {
    if (key === "application") navigate("/application-form");
    if (key === "advance") navigate("/advance-settlement");
    if (key === "reimbursement") navigate("/expense-reimbursement");
    if (key === "profile") navigate("/profile");
  };

  return (
    <div className="home-root">
      
      <header className="home-header">
        <img src={mitLogo} alt="MIT-ADT University" className="brand-logo" />
      </header>

      
      <div className="profile-wrap">
        <div
          className="avatar"
          title={user?.name || "Profile"}
          onClick={() => handleAction("profile")}
        >
          {user?.avatarDataUrl && !imageError ? (
            <img
              src={user.avatarDataUrl}
              alt="Profile"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="avatar-initials">{initials}</span>
          )}
        </div>
      </div>

      
      <main className="home-main">
        
        <section className="hero">
          <div className="hero-left">
            <h1 className="hero-title">
              Manage advances, settlements and reimbursements quickly
            </h1>
            <p className="hero-sub">
              A simple, secure flow for faculty to request advances, upload bills
              and settle expenses.
            </p>

            <div className="hero-cta">
              <button
                className="cta-primary"
                onClick={() => handleAction("application")}
              >
                Create Application
              </button>
              <button
                className="cta-outline"
                onClick={() => handleAction("reimbursement")}
              >
                Start Reimbursement
              </button>
            </div>
          </div>

          <aside className="hero-stats">
            <div className="stat">
              <div className="label">Pending Forms</div>
              <div className="num">{pendingCount}</div>
            </div>
            <div className="stat">
              <div className="label">Unsettled Advances</div>
              <div className="num">{unsettledCount}</div>
            </div>
          </aside>
        </section>

        
        <h2 className="quick-title">Quick Access</h2>

        <section className="feature-grid">
          <div className="feature" onClick={() => handleAction("application")}>
            <div className="icon-wrap">📄</div>
            <div>
              <h3 className="feature-title">Application for Advance</h3>
              <p className="feature-desc">Request funds with approval workflow.</p>
            </div>
            <button className="small-btn">Open</button>
          </div>

          <div className="feature" onClick={() => handleAction("advance")}>
            <div className="icon-wrap">➕</div>
            <div>
              <h3 className="feature-title">Advance Settlement</h3>
              <p className="feature-desc">Upload bills and settle advances.</p>
            </div>
            <button className="small-btn">Start</button>
          </div>

          <div className="feature" onClick={() => handleAction("reimbursement")}>
            <div className="icon-wrap">💰</div>
            <div>
              <h3 className="feature-title">Reimbursement</h3>
              <p className="feature-desc">Claim expenses and download PDFs.</p>
            </div>
            <button className="small-btn">Start</button>
          </div>

          <div className="feature" onClick={() => handleAction("profile")}>
            <div className="icon-wrap">👤</div>
            <div>
              <h3 className="feature-title">Profile</h3>
              <p className="feature-desc">View and edit personal details.</p>
            </div>
            <button className="small-btn">View</button>
          </div>
        </section>

        <footer className="home-footer">
          © 2025 MIT-ADT University — All rights reserved.
        </footer>
      </main>
    </div>
  );
}
