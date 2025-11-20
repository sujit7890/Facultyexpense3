
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mitLogo from "../asset/MITADTU.png"; 

export default function Home() {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData")) || null;
    } catch {
      return null;
    }
  })();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FB";

  const handleAction = (key) => {
    switch (key) {
      case "application":
        navigate("/application-form");
        break;
      case "advance":
        navigate("/advance-settlement");
        break;
      case "reimbursement":
        navigate("/expense-reimbursement");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        console.log("unhandled", key);
    }
  };

  return (
    <>
      <style>{`
        :root{
          --bg1: #f6fbff;
          --bg2: #eef7ff;
          --card: #ffffff;
          --muted: #64748b;
          --accent: #2563eb;
          --accent2: #7c3aed;
          --glass: rgba(15,23,42,0.06);
        }

        /* Page root */
        .home-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 60%);
          color: #07102a;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        /* header */
        .home-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px 20px;
          background: rgba(255,255,255,0.8);
          border-bottom: 1px solid rgba(10,20,40,0.04);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .brand {
          display:flex;
          align-items:center;
          gap:16px;
        }
        .brand-logo {
          height:84px;
          width:auto;
          border-radius:8px;
          padding:6px;
          background:white;
          box-shadow:0 8px 26px rgba(2,6,23,0.06);
        }

        /* profile avatar on right (bigger) */
        .header-spacer { flex: 1; }
        .profile-wrap {
          display:flex;
          align-items:center;
          gap:12px;
          position: absolute;
          right: 22px;
          top: 12px;
        }
        .avatar {
          width:56px;
          height:56px;
          border-radius:50%;
          display:grid;
          place-items:center;
          font-weight:700;
          color:white;
          background: linear-gradient(180deg,var(--accent),var(--accent2));
          box-shadow: 0 8px 30px rgba(37,99,235,0.12);
          border: 3px solid rgba(255,255,255,0.85);
          cursor: pointer;
          overflow: hidden;
        }
        .avatar img {
          width:100%;
          height:100%;
          object-fit: cover;
          display: block;
        }
        .avatar-initials {
          font-size: 16px;
          line-height: 1;
        }
        .avatar svg { width:26px; height:26px; filter: drop-shadow(0 1px 0 rgba(0,0,0,0.04)); }

        /* container */
        .home-main {
          width:100%;
          max-width:1200px;
          margin: 28px auto;
          padding: 0 20px 48px;
          box-sizing: border-box;
        }

        /* hero / banner */
        .hero {
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
          padding: 28px;
          border-radius: 14px;
          box-shadow: 0 14px 40px rgba(2,6,23,0.05);
          display:flex;
          gap:20px;
          align-items:center;
        }
        .hero-left { flex:1; }
        .hero-title {
          margin:0 0 10px 0;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          font-weight:800;
        }
        .hero-sub { margin:0; color:var(--muted); }

        .hero-cta { margin-top: 16px; display:flex; gap:12px; align-items:center; }
        .cta-primary {
          background: linear-gradient(90deg,var(--accent),var(--accent2));
          color:white;
          padding:12px 18px;
          border-radius:10px;
          font-weight:800;
          border:none;
          cursor:pointer;
          box-shadow: 0 12px 36px rgba(37,99,235,0.12);
        }
        .cta-outline {
          background:transparent;
          border:1px solid rgba(10,20,40,0.06);
          padding:12px 16px;
          border-radius:10px;
          cursor:pointer;
        }

        /* stats panel */
        .hero-stats {
          width:240px;
          display:flex;
          flex-direction:column;
          gap:12px;
        }
        .stat {
          background: linear-gradient(180deg,#fbfdff,#ffffff);
          padding:14px;
          border-radius:10px;
          text-align:center;
          border:1px solid rgba(10,20,40,0.03);
          box-shadow: 0 8px 26px rgba(2,6,23,0.04);
        }
        .stat .num { font-size:1.35rem; font-weight:800; color:#0b1220; }
        .stat .label { color:var(--muted); }

        /* quick access */
        .quick-title { text-align:center; margin:28px 0 12px; font-size:1.3rem; font-weight:800; color:#07102a; }

        .feature-grid {
          display:grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap:18px;
        }

        .feature {
          display:flex;
          gap:14px;
          padding: 18px;
          border-radius:12px;
          align-items:center;
          background: linear-gradient(180deg,#fff,#fbfdff);
          box-shadow: 0 12px 36px rgba(2,6,23,0.04);
          border: 1px solid rgba(10,20,40,0.03);
        }
        .icon-wrap {
          width:64px;
          height:64px;
          border-radius:12px;
          display:grid;
          place-items:center;
          background: linear-gradient(180deg, rgba(37,99,235,0.08), rgba(124,58,237,0.02));
          flex-shrink:0;
        }
        .feature-body { flex:1; }
        .feature-title { margin:0; font-weight:800; }
        .feature-desc { margin:4px 0 0 0; color:var(--muted); font-size:0.95rem; }

        .feature-action { margin-left:auto; }
        .small-btn {
          padding:10px 12px;
          border-radius:10px;
          border:none;
          background: linear-gradient(90deg,var(--accent),var(--accent2));
          color:white;
          font-weight:800;
          cursor:pointer;
        }

        /* footer */
        .home-footer { text-align:center; color:var(--muted); margin-top:22px; font-size:0.95rem; }

        /* responsive */
        @media (max-width: 1100px) {
          .feature-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .hero-stats { display:none; }
        }
        @media (max-width: 720px) {
          .feature-grid { grid-template-columns: 1fr; }
          .profile-wrap { right: 12px; top: 8px; }
          .brand-logo { height:64px; }
        }
      `}</style>

      <div className="home-root">
        <header className="home-header" role="banner">
          <div className="brand">
            <img src={mitLogo} alt="MIT-ADT University" className="brand-logo" />
          </div>

          <div className="profile-wrap" role="navigation" aria-label="User menu">
            {/* CSS avatar with initials or image; clickable to go to profile */}
            <div
              className="avatar"
              title={user?.name ? `Signed in as ${user.name}` : "View profile"}
              onClick={() => handleAction("profile")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleAction("profile")}
              aria-label="Open profile"
            >
              {user?.avatarDataUrl && !imageError ? (
                <img
                  src={user.avatarDataUrl}
                  alt={user?.name ? `${user.name} profile` : "Profile picture"}
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="avatar-initials" aria-hidden>{initials}</span>
              )}
            </div>
          </div>
        </header>

        <main className="home-main" id="maincontent">
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-left">
              <h1 id="hero-heading" className="hero-title">Manage advances, settlements and reimbursements — quickly</h1>
              <p className="hero-sub">A simple, secure flow for faculty to request advances, upload bills and settle expenses.</p>

              <div className="hero-cta">
                <button className="cta-primary" onClick={() => handleAction("application")}>Create Application</button>
                <button className="cta-outline" onClick={() => handleAction("reimbursement")}>Start Reimbursement</button>
              </div>
            </div>

            <aside className="hero-stats" aria-hidden>
              <div className="stat">
                <div className="label">Pending Forms</div>
                <div className="num">7</div>
              </div>
              <div className="stat">
                <div className="label">Unsettled Advances</div>
                <div className="num">3</div>
              </div>
            </aside>
          </section>

          <h2 className="quick-title">Quick Access</h2>

          <section className="feature-grid" aria-label="Quick features">
            {/* Document icon */}
            <article className="feature" role="button" tabIndex={0} onClick={() => handleAction("application")}>
              <div className="icon-wrap" aria-hidden>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="3" width="14" height="18" rx="2" stroke="#2563eb" strokeWidth="1.4" fill="rgba(99,102,241,0.04)"/>
                  <path d="M8 7h6M8 11h8M8 15h5" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="feature-body">
                <h3 className="feature-title">Application for Advance</h3>
                <p className="feature-desc">Request funds for travel, conferences & research — quick form and approval workflow.</p>
              </div>

              <div className="feature-action">
                <button className="small-btn" onClick={(e)=>{e.stopPropagation(); handleAction('application');}}>Open</button>
              </div>
            </article>

            {/* Plus icon */}
            <article className="feature" role="button" tabIndex={0} onClick={() => handleAction("advance")}>
              <div className="icon-wrap" aria-hidden>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="6" stroke="#7c3aed" strokeWidth="1.2" fill="rgba(124,58,237,0.06)"/>
                  <path d="M12 8v8M8 12h8" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="feature-body">
                <h3 className="feature-title">Advance Settlement</h3>
                <p className="feature-desc">Upload bills, attach receipts and finalize the advance settlement.</p>
              </div>

              <div className="feature-action">
                <button className="small-btn" onClick={(e)=>{e.stopPropagation(); handleAction('advance');}}>Start</button>
              </div>
            </article>

            {/* Money bag icon */}
            <article className="feature" role="button" tabIndex={0} onClick={() => handleAction("reimbursement")}>
              <div className="icon-wrap" aria-hidden>
                <svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="6" fill="rgba(37,99,235,0.06)" stroke="#2563eb" strokeWidth="1.2"/>
                  <path d="M12 6c1 0 1.4.6 1.4 1.6C13.4 9 11.6 9 11.6 11.2S14 12.4 14 14" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="15.5" r="0.9" fill="#2563eb"/>
                </svg>
              </div>

              <div className="feature-body">
                <h3 className="feature-title">Reimbursement</h3>
                <p className="feature-desc">Start a reimbursement flow — choose with-bill or without-bill and download PDFs.</p>
              </div>

              <div className="feature-action">
                <button className="small-btn" onClick={(e)=>{e.stopPropagation(); handleAction('reimbursement');}}>Start</button>
              </div>
            </article>

            {/* Profile icon */}
            <article className="feature" role="button" tabIndex={0} onClick={() => handleAction("profile")}>
              <div className="icon-wrap" aria-hidden>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="6" stroke="#6b7280" strokeWidth="1.1" fill="rgba(99,102,241,0.02)"/>
                  <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="#6b7280" strokeWidth="1.2"/>
                  <path d="M5 19c1.6-3 6.4-3 7-3s5.4 0 7 3" stroke="#6b7280" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="feature-body">
                <h3 className="feature-title">Profile</h3>
                <p className="feature-desc">View and edit your name, contact and department details.</p>
              </div>

              <div className="feature-action">
                <button className="small-btn" onClick={(e)=>{e.stopPropagation(); handleAction('profile');}}>View</button>
              </div>
            </article>

            {/* Admin icon */}
            <article className="feature" role="button" tabIndex={0} onClick={() => handleAction("admin")}>
              <div className="icon-wrap" aria-hidden>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="6" stroke="#0b1220" strokeWidth="0.9" fill="rgba(0,0,0,0.03)"/>
                  <path d="M6 10h12M6 14h8" stroke="#0b1220" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="feature-body">
                <h3 className="feature-title">Admin Panel</h3>
                <p className="feature-desc">For admins: overview of submitted forms and approvals.</p>
              </div>

              <div className="feature-action">
                <button className="small-btn" onClick={(e)=>{e.stopPropagation(); handleAction('admin');}}>Open</button>
              </div>
            </article>
          </section>

          <footer className="home-footer">© 2025 MIT-ADT University — All rights reserved.</footer>
        </main>
      </div>
    </>
  );
}
