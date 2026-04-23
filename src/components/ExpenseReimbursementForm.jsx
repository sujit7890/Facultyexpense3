import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import collegeLogo from '../asset/MITADTU.png';
import './styles/ExpenseReimbursementForm.css';


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
