// src/components/ApplicationForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import collegeLogo from "../asset/MITADTU.png";

export default function ApplicationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    amount: "",
    purpose: "",
    justification: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // protect number field from invalid input
    if (name === "amount") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((p) => ({ ...p, [name]: value }));
      }
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () =>
    setFormData({
      name: "",
      department: "",
      amount: "",
      purpose: "",
      justification: "",
      date: "",
    });

  const validate = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.department) {
      toast.error("Please select a department");
      return false;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount (> 0)");
      return false;
    }
    if (!formData.purpose) {
      toast.error("Please select a purpose");
      return false;
    }
    if (!formData.date) {
      toast.error("Please select expected settlement date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const backendURL = "http://172.20.10.3:8000/api/application";
    setSubmitting(true);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          department: formData.department,
          amount: Number(formData.amount),
          purpose: formData.purpose,
          justification: formData.justification || "",
          expected_settlement: formData.date,
        }),
      });

      // handle non-JSON response gracefully
      if (!res.ok) {
        let msg = `Server responded ${res.status}`;
        try {
          const txt = await res.text();
          if (txt) msg = txt;
        } catch {}
        throw new Error(msg);
      }

      // try parse JSON but ignore if not JSON
      try {
        await res.json();
      } catch {}

      toast.success("Application saved ✔");
      resetForm();
      // optional: navigate to home or show summary
      // setTimeout(() => navigate('/home'), 800);
    } catch (err) {
      console.error("submit error:", err);
      toast.error("Failed to save application — check network/backend");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg1: #f6f9ff;
          --bg2: #eef7ff;
          --card: #ffffff;
          --muted: #64748b;
          --accent: #2563eb;
          --accent2: #7c3aed;
          --glass: rgba(10,20,40,0.04);
        }
        .app-form-page{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:36px 20px;
          background: linear-gradient(180deg,var(--bg1),var(--bg2));
          box-sizing:border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .app-form-card{
          width:100%;
          max-width:920px;
          background: linear-gradient(180deg,var(--card),#fbfdff);
          border-radius:14px;
          padding:26px;
          box-shadow: 0 22px 60px rgba(2,6,23,0.06);
          border:1px solid var(--glass);
        }
        .form-top{ display:flex; align-items:center; gap:18px; margin-bottom:14px; }
        .form-logo{ width:84px; height:auto; border-radius:10px; background:white; padding:8px; box-shadow:0 8px 24px rgba(2,6,23,0.04); }
        .form-header-text{ display:flex; flex-direction:column; }
        .form-title{ font-size:1.35rem; font-weight:800; color:#07102a; }
        .form-sub{ color:var(--muted); margin-top:4px; font-size:0.98rem; }
        .back-button{ margin-left:auto; background:transparent; border:none; color:var(--accent); font-weight:800; cursor:pointer; font-size:0.95rem; }
        .form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:12px; }
        .form-row-full{ grid-column:1 / -1; }
        label{ display:block; font-size:0.95rem; color:#0f172a; font-weight:700; margin-bottom:8px; }
        input[type="text"], input[type="number"], input[type="date"], select, textarea{
          width:100%; padding:12px 14px; border-radius:10px; border:1px solid #e6eef9; background:#fff; font-size:1rem;
          transition: box-shadow .16s ease, border-color .16s ease;
        }
        textarea{ min-height:120px; resize:vertical; padding-top:10px; }
        input:focus, select:focus, textarea:focus{ outline:none; border-color:var(--accent); box-shadow:0 10px 28px rgba(37,99,235,0.08); }
        .form-actions{ display:flex; justify-content:flex-end; gap:12px; margin-top:18px; }
        .btn{ padding:11px 16px; border-radius:12px; font-weight:800; cursor:pointer; border:none; font-size:0.98rem; }
        .btn-primary{ background: linear-gradient(90deg,var(--accent),var(--accent2)); color:white; box-shadow:0 12px 30px rgba(37,99,235,0.12); }
        .btn-outline{ background:transparent; border:1px solid var(--glass); color:#07102a; }
        .help-note{ font-size:0.95rem; color:var(--muted); margin-top:10px; }
        @media (max-width:880px){
          .form-grid{ grid-template-columns: 1fr; }
          .form-actions{ justify-content:stretch; flex-direction:column-reverse; }
          .form-actions .btn{ width:100%; }
          .back-button{ margin-left:0; }
        }
      `}</style>

      <div className="app-form-page" role="main">
        <div className="app-form-card" aria-labelledby="app-form-heading">
          <div className="form-top">
            <Link to="/">
              <img src={collegeLogo} alt="College Logo" className="form-logo" />
            </Link>

            <div className="form-header-text">
              <div id="app-form-heading" className="form-title">Application for Advance</div>
              <div className="form-sub">Request advance funds for official expenses</div>
            </div>

            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              type="button"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div>
                <label htmlFor="name">Faculty Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Prof .XYZ"
                  required
                />
              </div>

              <div>
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                  <option value="Civil">Civil</option>
                  <option value="Design">Design</option>
                  <option value="IT">Information Technology</option>
                </select>
              </div>

              <div>
                <label htmlFor="amount">Advance Amount (₹)</label>
                <input id="amount" name="amount" type="number" min="0" step="1" value={formData.amount} onChange={handleChange} placeholder="0" required />
              </div>

              <div>
                <label htmlFor="purpose">Purpose</label>
                <select id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required>
                  <option value="">Select purpose</option>
                  <option>Conference Attendance</option>
                  <option>Research Materials</option>
                  <option>Equipment Purchase</option>
                  <option>Field Work</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-row-full">
                <label htmlFor="justification">Detailed Justification (optional)</label>
                <textarea id="justification" name="justification" value={formData.justification} onChange={handleChange} />
              </div>

              <div>
                <label htmlFor="date">Expected Date of Settlement</label>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>

            <div className="help-note">Fill required fields and press <strong>Submit Application</strong>.</div>

            <div className="form-actions" role="group" aria-label="Form actions">
              <button type="button" className="btn btn-outline" onClick={resetForm} disabled={submitting}>Reset</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}
