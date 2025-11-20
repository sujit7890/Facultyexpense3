import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import collegeLogo from '../asset/MITADTU.png';

function ExpenseReimbursementForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
  });

  useEffect(() => {
    // Prefill from localStorage if available
    try {
      const saved = JSON.parse(localStorage.getItem('basicDetails') || 'null');
      if (saved && typeof saved === 'object') {
        setFormData((prev) => ({ ...prev, ...saved }));
      }
    } catch (err) {
      // ignore parse errors
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = () => {
    // Basic validation
    if (!formData.name.trim() || !formData.employeeId.trim() || !formData.department) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Save to localStorage
    localStorage.setItem('basicDetails', JSON.stringify(formData));
    toast.success('Details saved — redirecting...');
    setTimeout(() => {
      navigate('/reimbursement/with-bill');
    }, 600);
  };

  const resetForm = () => {
    setFormData({ name: '', employeeId: '', department: '' });
    localStorage.removeItem('basicDetails');
    toast.info('Form cleared');
  };

  return (
    <>
      <style>{`
        :root{
          --bg-start: #f7fbff;
          --bg-end: #eef7ff;
          --card-bg: #ffffff;
          --muted: #6b7280;
          --accent: #2563eb;
          --accent-2: #7c3aed;
          --glass: rgba(15,23,42,0.06);
          --radius: 14px;
        }

        /* Page */
        .reim-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 18px;
          background: linear-gradient(180deg, var(--bg-start), var(--bg-end));
          box-sizing: border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Card */
        .reim-card {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 26px;
          background: linear-gradient(180deg, var(--card-bg), #fbfdff);
          border-radius: var(--radius);
          padding: 28px;
          box-shadow: 0 28px 70px rgba(2,6,23,0.08);
          border: 1px solid var(--glass);
        }

        /* Left column (form) */
        .reim-left {
          padding-right: 6px;
        }

        .top-row {
          display:flex;
          align-items:center;
          gap:18px;
          margin-bottom: 6px;
        }
        .logo {
          width:96px;
          height:auto;
          border-radius:10px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          background: white;
          padding: 8px;
        }
        .title-area { display:flex; flex-direction:column; }
        .title { font-size:1.4rem; font-weight:900; color:#07102a; line-height:1; }
        .subtitle { font-size:1rem; color:var(--muted); margin-top:6px; max-width:720px; }

        .back-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: var(--accent);
          font-weight:800;
          cursor:pointer;
          font-size:0.95rem;
        }

        /* Form grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 18px;
        }
        .field {
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        label { font-weight:800; font-size:1rem; color:#0f172a; }

        input[type="text"], select {
          padding: 14px 16px;
          font-size:1rem;
          border-radius:12px;
          border: 1px solid #e9f0fb;
          background: #fff;
          transition: box-shadow .18s, border-color .18s;
          box-shadow: 0 6px 18px rgba(15,23,42,0.02);
        }
        input[type="text"]::placeholder { color: #cbd5ff; }
        select {
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%);
          background-position: calc(100% - 18px) calc(0.5em + 6px), calc(100% - 12px) calc(0.5em + 6px);
          background-size: 8px 8px, 8px 8px;
          background-repeat: no-repeat;
          padding-right: 44px;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 12px 36px rgba(37,99,235,0.08);
        }

        /* Notice/text */
        .note { font-size:0.95rem; color:var(--muted); margin-top:12px; }

        /* Right column (summary) */
        .reim-right {
          display:flex;
          flex-direction:column;
          gap:14px;
          align-items:stretch;
        }

        .summary-card {
          background: linear-gradient(180deg,#ffffff,#fbfdff);
          padding:20px;
          border-radius:12px;
          border:1px solid var(--glass);
          box-shadow: 0 10px 34px rgba(2,6,23,0.04);
        }
        .summary-title { font-weight:900; font-size:1.05rem; color:#07102a; margin-bottom:8px; }
        .summary-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-top:1px dashed #eef4ff; font-weight:800; color:#374151; }
        .summary-row:first-of-type { border-top: none; }

        .summary-preview {
          font-size:0.95rem;
          color:var(--muted);
          margin-top:8px;
        }

        /* actions */
        .form-actions {
          margin-top: 18px;
          display:flex;
          justify-content:flex-end;
          gap:12px;
        }
        .btn {
          padding: 12px 18px;
          border-radius: 12px;
          font-weight:900;
          cursor:pointer;
          border:none;
          font-size:1rem;
        }
        .btn-primary {
          background: linear-gradient(90deg,var(--accent),var(--accent-2));
          color:white;
          box-shadow: 0 14px 36px rgba(37,99,235,0.14);
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--glass);
          color: #07102a;
          padding: 12px 16px;
        }

        /* footer smaller text inside summary column */
        .small-footer { text-align:center; color:var(--muted); font-size:0.9rem; margin-top:10px; }

        /* responsive */
        @media (max-width: 980px) {
          .reim-card { grid-template-columns: 1fr; padding: 20px; }
          .reim-right { order: 2; }
          .reim-left { order: 1; }
          .back-btn { margin-left: 0; }
          .form-actions { justify-content: stretch; flex-direction: column-reverse; }
          .form-actions .btn { width: 100%; }
        }

        /* accessibility focus */
        .btn:focus, input:focus, select:focus { outline-offset: 3px; }

      `}</style>

      <div className="reim-page">
        <div className="reim-card" role="region" aria-labelledby="reim-title">
          <div className="reim-left">
            <div className="top-row">
              <Link to="/">
                <img src={collegeLogo} alt="College Logo" className="logo" />
              </Link>

              <div className="title-area">
                <div id="reim-title" className="title">Basic Reimbursement Details</div>
                <div className="subtitle">Quickly enter the basic information we need to prefill your reimbursement form.</div>
              </div>

              <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleRedirect(); }} aria-describedby="reim-note">
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Faculty Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Prof. XYZ"
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="employeeId">Employee ID</label>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter your employee ID"
                    aria-required="true"
                    autoComplete="off"
                  />
                </div>

                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    aria-required="true"
                  >
                    <option value="">Select department</option>
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="ECE">Electrical Engineering (ECE)</option>
                    <option value="ME">Mechanical Engineering (Mechanical)</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                    <option value="Civil">Civil</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <div style={{ height: 6 }} />
                  <div id="reim-note" className="note">Enter accurate details so forms are prefilled correctly on the next page.</div>
                </div>
              </div>

              <div className="form-actions" role="group" aria-label="Form actions">
                <button type="button" className="btn btn-ghost" onClick={resetForm} aria-label="Clear form">Clear</button>
                <button type="submit" className="btn btn-primary" aria-label="Proceed to reimbursement">Go to Form</button>
              </div>
            </form>
          </div>

          <aside className="reim-right" aria-labelledby="summary-title">
            <div className="summary-card" aria-live="polite">
              <div id="summary-title" className="summary-title">Preview</div>

              <div className="summary-row">
                <div style={{ color: '#64748b' }}>Applicant</div>
                <div>{formData.name || '—'}</div>
              </div>

              <div className="summary-row">
                <div style={{ color: '#64748b' }}>Employee ID</div>
                <div>{formData.employeeId || '—'}</div>
              </div>

              <div className="summary-row">
                <div style={{ color: '#64748b' }}>Department</div>
                <div>{formData.department || '—'}</div>
              </div>

              <div className="summary-preview" style={{ marginTop: 10 }}>
                <strong>Note:</strong>
                <div style={{ marginTop: 8 }}>After you click <em>Go to Form</em>, you'll be redirected and the reimbursement form will be prefilled using these details.</div>
              </div>
            </div>

            <div className="small-footer">
              © 2025 MIT-ADT University — Faculty Expense Management
            </div>
          </aside>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2200} hideProgressBar={false} newestOnTop />
    </>
  );
}

export default ExpenseReimbursementForm;
