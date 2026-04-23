// src/components/ApplicationForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import collegeLogo from "../asset/MITADTU.png";
import "./styles/ApplicationForm.css";

import { submitAdvanceApplication } from "../firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const auth = getAuth();

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

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      department: formData.department,
      amount: Number(formData.amount),
      purpose: formData.purpose,
      justification: formData.justification || "",
      expectedSettlementDate: formData.date,
    };

    const success = await submitAdvanceApplication(payload, user);

    if (success) {
      toast.success("Application for Advance submitted ✔");
      resetForm();
      // optional navigation
      // navigate("/home");
    } else {
      toast.error("Failed to submit application");
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className="app-form-page" role="main">
        <div className="app-form-card" aria-labelledby="app-form-heading">
          <div className="form-top">
            <Link to="/">
              <img src={collegeLogo} alt="College Logo" className="form-logo" />
            </Link>

            <div className="form-header-text">
              <div id="app-form-heading" className="form-title">
                Application for Advance
              </div>
              <div className="form-sub">
                Request advance funds for official expenses
              </div>
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
                  placeholder="e.g., Prof. XYZ"
                  required
                />
              </div>

              <div>
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
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
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="purpose">Purpose</label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select purpose</option>
                  <option>Conference Attendance</option>
                  <option>Research Materials</option>
                  <option>Equipment Purchase</option>
                  <option>Field Work</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-row-full">
                <label htmlFor="justification">
                  Detailed Justification (optional)
                </label>
                <textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="date">Expected Date of Settlement</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="help-note">
              Fill required fields and press{" "}
              <strong>Submit Application</strong>.
            </div>

            <div className="form-actions" role="group">
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
                disabled={submitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
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
