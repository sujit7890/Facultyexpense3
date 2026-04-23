import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import collegeLogo from '../asset/MITADTU.png';
import './styles/AdvanceSettlementForm.css';

import { submitAdvanceSettlement } from "../firebase/firestore";
import { getAuth } from "firebase/auth";

const AdvanceSettlementForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    amount: '',
    details: '',
  });


  useEffect(() => {
    const savedDraft = localStorage.getItem("advanceSettlementDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    localStorage.setItem('advanceSettlementDraft', JSON.stringify(formData));
    toast.success('Draft saved locally');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter name fields");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login first");
      return;
    }

    const success = await submitAdvanceSettlement(formData, user);

    if (success) {
      toast.success("Advance Settlement submitted successfully ✔");

      setFormData({
        firstName: "",
        lastName: "",
        designation: "",
        amount: "",
        details: "",
      });

      localStorage.removeItem("advanceSettlementDraft");
      navigate("/home");
    } else {
      toast.error("Error submitting form");
    }
  };

  return (
    <>
      

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
            <p className="as-sub">Fill the details below.</p>

            <ToastContainer position="top-center" autoClose={2500} />

            <form className="as-form" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">First Name</label>
                <input name="firstName" className="as-input" value={formData.firstName} onChange={handleChange} />
              </div>

              <div className="field">
                <label className="field-label">Last Name</label>
                <input name="lastName" className="as-input" value={formData.lastName} onChange={handleChange} />
              </div>

              <div className="field">
                <label className="field-label">Designation</label>
                <input name="designation" className="as-input" value={formData.designation} onChange={handleChange} />
              </div>

              <div className="field">
                <label className="field-label">Advance Amount (₹)</label>
                <input type="number" name="amount" className="as-input" value={formData.amount} onChange={handleChange} />
              </div>

              <div className="field form-full">
                <label className="field-label">Settlement Details</label>
                <textarea name="details" className="as-textarea" value={formData.details} onChange={handleChange}></textarea>
              </div>

              <div className="as-actions">
                <button type="button" className="btn btn-ghost" onClick={handleSaveDraft}>Save Draft</button>
                <button type="submit" className="btn btn-primary">Submit Form</button>
              </div>
            </form>
          </div>

          <aside className="summary-card">
            <strong>Form Summary</strong>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.designation}</p>
            <p>{formData.amount ? `₹${formData.amount}` : "-"}</p>
          </aside>
        </div>
      </div>
    </>
  );
};

export default AdvanceSettlementForm;
