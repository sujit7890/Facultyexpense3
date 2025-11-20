import React, { useEffect, useState } from "react";

const STORAGE_KEY = "formCounts";
const DEFAULT_COUNTS = {
  applicationForm: 5,
  advanceSettlement: 3,
  expenseReimbursement: 7,
};

function Admin() {
  const [formCounts, setFormCounts] = useState({
    applicationForm: 0,
    advanceSettlement: 0,
    expenseReimbursement: 0,
  });

  useEffect(() => {
    // Load stored form counts from localStorage (replace with API if needed)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_COUNTS;
    setFormCounts(stored);
  }, []);

  // Keep localStorage in sync if counts change elsewhere in the app
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formCounts));
  }, [formCounts]);

  // Small UI helpers (non-invasive — you can remove if not needed)
  const resetCounts = () => {
    setFormCounts(DEFAULT_COUNTS);
  };

  const clearCounts = () => {
    const zeros = { applicationForm: 0, advanceSettlement: 0, expenseReimbursement: 0 };
    setFormCounts(zeros);
  };

  return (
    <>
      <style>{`
        :root {
          --accent: #2563eb;
          --muted: #64748b;
          --bg: transparent;
          --card-bg: rgba(255,255,255,0.6);
          --glass-border: rgba(15,23,42,0.04);
          --radius: 12px;
          --shadow: 0 10px 30px rgba(2,6,23,0.06);
          --transition: 220ms cubic-bezier(.2,.9,.3,1);
        }

        /* Page root - keep transparent and rely on global background */
        .admin-page {
          min-height: 72vh;
          padding: 28px;
          box-sizing: border-box;
          color: #07102a;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .admin-heading {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }

        .admin-heading h1 {
          font-size: 1.45rem;
          margin: 0;
          font-weight: 800;
        }

        .admin-sub {
          color: var(--muted);
          font-size: 0.95rem;
        }

        /* summary grid */
        .admin-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 16px;
          width: 100%;
        }

        /* Each metric tile — subtle, not a large container behind the page */
        .admin-card {
          padding: 18px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
          justify-content: center;
          box-shadow: var(--shadow);
          border: 1px solid var(--glass-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.6));
          transition: transform var(--transition), box-shadow var(--transition);
          min-height: 120px;
        }

        .admin-card:focus-within,
        .admin-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(2,6,23,0.08);
        }

        .admin-card h2 {
          margin: 0;
          font-size: 1rem;
          color: #0b1220;
          font-weight: 700;
        }

        .admin-card p {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .admin-actions {
          display:flex;
          gap:10px;
          align-items:center;
        }

        .btn {
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          font-weight: 700;
          transition: transform var(--transition), box-shadow var(--transition);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(10,20,40,0.06);
          color: #07102a;
        }

        .btn-primary {
          background: linear-gradient(90deg, var(--accent), #7c3aed);
          color: #fff;
          box-shadow: 0 10px 30px rgba(37,99,235,0.12);
        }

        .btn:hover {
          transform: translateY(-3px);
        }

        /* footer inside admin page */
        .admin-footer {
          margin-top: 6px;
          color: var(--muted);
          font-size: 0.95rem;
        }

        /* responsive */
        @media (max-width: 980px) {
          .admin-summary {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }
        }
        @media (max-width: 600px) {
          .admin-summary {
            grid-template-columns: 1fr;
          }
          .admin-card { min-height: 100px; padding: 14px; }
        }
      `}</style>

      <div className="admin-page" role="main">
        <div className="admin-heading">
          <div>
            <h1>Admin Dashboard</h1>
            <div className="admin-sub">Overview of submitted forms and pending requests</div>
          </div>

          <div className="admin-actions" aria-hidden>
            <button className="btn btn-ghost" onClick={clearCounts} title="Clear counts (set to 0)">Clear</button>
            <button className="btn btn-ghost" onClick={resetCounts} title="Reset to defaults">Reset</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                // small example action — in production, replace with real navigation / API fetch
                const next = {
                  applicationForm: formCounts.applicationForm + 1,
                  advanceSettlement: formCounts.advanceSettlement + 1,
                  expenseReimbursement: formCounts.expenseReimbursement + 1,
                };
                setFormCounts(next);
              }}
              title="Simulate new submissions"
            >
              Simulate +1
            </button>
          </div>
        </div>

        <div className="admin-summary" aria-live="polite">
          <div className="admin-card" tabIndex={0}>
            <h2>Application for Advance</h2>
            <p role="status" aria-label={`${formCounts.applicationForm} applications`}>{formCounts.applicationForm}</p>
            <div style={{ marginTop: 8, color: "#475569", fontSize: 13 }}>Pending approvals & submitted forms</div>
          </div>

          <div className="admin-card" tabIndex={0}>
            <h2>Advance Settlement</h2>
            <p role="status" aria-label={`${formCounts.advanceSettlement} settlements`}>{formCounts.advanceSettlement}</p>
            <div style={{ marginTop: 8, color: "#475569", fontSize: 13 }}>Settlements awaiting reconciliation</div>
          </div>

          <div className="admin-card" tabIndex={0}>
            <h2>Reimbursement of Expenses</h2>
            <p role="status" aria-label={`${formCounts.expenseReimbursement} reimbursements`}>{formCounts.expenseReimbursement}</p>
            <div style={{ marginTop: 8, color: "#475569", fontSize: 13 }}>Reimbursements (with/without bill)</div>
          </div>
        </div>

        <footer className="admin-footer">
          <p>&copy; {new Date().getFullYear()} MIT-ADT University | Faculty Admin Portal</p>
        </footer>
      </div>
    </>
  );
}

export default Admin;
