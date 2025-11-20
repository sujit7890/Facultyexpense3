import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import collegeLogo from '../asset/MITADTU.png';

const AdvanceSettlementForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    amount: '',
    details: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    localStorage.setItem('advanceSettlementDraft', JSON.stringify(formData));
    toast.success('Draft saved locally');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter name fields");
      return;
    }

    // example backend
    const backendURL = "http://172.20.10.3:8000";

    fetch(`${backendURL}/api/settlement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        faculty_name: `${formData.firstName} ${formData.lastName}`,
        advance_id: 0,
        total_expense: formData.amount,
        balance_returned: 0,
        details: formData.details,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        toast.success("Form submitted and stored in database ✔");

        setFormData({
          firstName: "",
          lastName: "",
          designation: "",
          amount: "",
          details: "",
        });

        navigate("/home");
      })
      .catch((err) => {
        toast.error("Error connecting to backend");
        console.error(err);
      });
  };

  return (
    <>
      <style>{`
        /* Page background */
        .as-page {
          min-height: 100vh;
          background: linear-gradient(180deg,#f6fbff 0%, #eef6ff 60%);
          display:flex;
          align-items:flex-start;
          justify-content:center;
          padding: 36px 18px;
          box-sizing:border-box;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Wrapper holds the left form and right summary */
        .as-wrapper {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }

        /* Main card */
        .as-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 18px 48px rgba(8,24,50,0.06);
          border: 1px solid rgba(10, 20, 40, 0.04);
        }

        /* Logo centered and larger */
        .logo-center {
          display:flex;
          justify-content:center;
          margin-bottom: 14px;
        }
        .logo-large {
          height: 96px;
          width: auto;
          object-fit:contain;
          border-radius:8px;
          box-shadow: 0 8px 20px rgba(2,6,23,0.04);
        }

        .as-back {
          background: transparent;
          border: none;
          color: #2563EB;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-bottom: 8px;
        }

        .as-title {
          font-size: 22px;
          font-weight: 800;
          color: #07102A;
          margin: 4px 0 6px;
        }
        .as-sub {
          color: #475569;
          margin: 0 0 18px;
        }

        /* Form layout */
        .as-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 18px;
        }

        .field {
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .field-label {
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .as-input, .as-textarea {
          padding: 14px 12px;
          border-radius: 12px;
          border: 1px solid #E6EEF9;
          background: #fff;
          font-size: 15px;
          color: #07102A;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
          transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
        }
        .as-input:focus, .as-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 10px 30px rgba(37,99,235,0.08);
          transform: translateY(-2px);
        }

        .form-full { grid-column: 1 / -1; }

        .as-textarea {
          min-height: 160px;
          resize: vertical;
        }

        /* Actions (buttons) */
        .as-actions {
          grid-column: 1 / -1;
          display:flex;
          gap:12px;
          justify-content:flex-end;
          margin-top: 6px;
        }

        .btn {
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor:pointer;
          border: none;
          box-shadow: 0 6px 18px rgba(2,6,23,0.05);
        }

        .btn-primary {
          background: linear-gradient(90deg,#2563eb,#7c3aed);
          color: white;
          letter-spacing: 0.2px;
          padding: 12px 20px;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(37,99,235,0.14); }

        .btn-ghost {
          background: #F1F5F9;
          color: #07102A;
          border: 1px solid rgba(15,23,42,0.04);
          padding: 12px 14px;
        }
        .btn-ghost:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(2,6,23,0.04); }

        /* Summary sidebar */
        .summary-card {
          position: sticky;
          top: 28px;
          height: fit-content;
          background: linear-gradient(180deg,#ffffff,#f8fbff);
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 12px 36px rgba(2,6,23,0.04);
          border: 1px solid rgba(10,20,40,0.03);
        }
        .summary-title {
          font-weight: 800;
          font-size: 16px;
          color: #07102A;
          margin-bottom: 8px;
        }
        .summary-note { color: #64748b; margin-bottom: 12px; font-size: 13px; }

        .summary-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding: 10px;
          border-radius:10px;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.03);
          margin-bottom: 10px;
        }
        .summary-row strong { color: #07102A; font-weight:800; }

        .summary-preview {
          background: #fff;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.03);
          color: #475569;
        }

        /* Responsive adjustments */
        @media (max-width: 980px) {
          .as-wrapper { grid-template-columns: 1fr; }
          .summary-card { position: relative; top: 0; margin-top: 12px; }
          .logo-large { height: 82px; }
          .as-card { padding: 20px; }
        }

      `}</style>

      <div className="as-page">
        <div className="as-wrapper">
          <div className="as-card">
            <div className="logo-center">
              <Link to="/">
                <img src={collegeLogo} alt="MIT ADT Logo" className="logo-large" />
              </Link>
            </div>

            <button className="as-back" onClick={() => navigate(-1)}>← Back</button>

            <h2 className="as-title">Format for Advance Settlement</h2>
            <p className="as-sub">Fill the details below. You can save a draft or submit.</p>

            <ToastContainer position="top-center" autoClose={2500} />

            <form className="as-form" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">First Name</label>
                <input
                  name="firstName"
                  className="as-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  aria-label="First name"
                />
              </div>

              <div className="field">
                <label className="field-label">Last Name</label>
                <input
                  name="lastName"
                  className="as-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  aria-label="Last name"
                />
              </div>

              <div className="field">
                <label className="field-label">Designation</label>
                <input
                  name="designation"
                  className="as-input"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter your designation"
                  aria-label="Designation"
                />
              </div>

              <div className="field">
                <label className="field-label">Advance Amount (₹)</label>
                <input
                  name="amount"
                  className="as-input"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  aria-label="Advance amount"
                />
              </div>

              <div className="field form-full">
                <label className="field-label">Settlement Details</label>
                <textarea
                  name="details"
                  className="as-textarea"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Provide details here..."
                  aria-label="Settlement details"
                ></textarea>
              </div>

              <div className="as-actions">
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/without-bill-form')}>
                  Go to Form
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleSaveDraft}>
                  Save Draft
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Form
                </button>
              </div>
            </form>
          </div>

          <aside className="summary-card" aria-live="polite">
            <div className="summary-title">Form Summary</div>
            <div className="summary-note">Live preview of the important fields — useful before submitting.</div>

            <div className="summary-row">
              <div>Applicant</div>
              <strong>
                {(formData.firstName || "—") + (formData.lastName ? ` ${formData.lastName}` : "")}
              </strong>
            </div>

            <div className="summary-row">
              <div>Designation</div>
              <strong>{formData.designation || "—"}</strong>
            </div>

            <div className="summary-row">
              <div>Advance Amount</div>
              <strong>{formData.amount ? `₹${formData.amount}` : "—"}</strong>
            </div>

            <div style={{ height: 8 }} />

            <div className="summary-preview">
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Settlement Details</div>
              {formData.details ? <p style={{ margin: 0 }}>{formData.details}</p> : <p style={{ margin: 0, color: '#94a3b8' }}>No details yet.</p>}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default AdvanceSettlementForm;
