import React, { useRef, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReimbursementForm = () => {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    school: '',
    date: '',
    staffName: '',
    department: '',
    designation: '',
    amount: '',
    amountWords: '',
    expenseReason: '',
    tableData: [{ srNo: 1, date: '', purpose: '', party: '', billNo: '', amount: '' }],
  });

  // helper: convert number to words (basic, supports up to billions)
  const numberToWords = (num) => {
    if (!Number.isFinite(num)) return '';
    if (num === 0) return 'zero';
    const a = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const toWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return `${b[Math.floor(n / 10)]}${n % 10 ? ' ' + a[n % 10] : ''}`;
      if (n < 1000) return `${a[Math.floor(n / 100)]} hundred${n % 100 ? ' ' + toWords(n % 100) : ''}`;
      if (n < 1_000_000) return `${toWords(Math.floor(n / 1000))} thousand${n % 1000 ? ' ' + toWords(n % 1000) : ''}`;
      if (n < 1_000_000_000) return `${toWords(Math.floor(n / 1_000_000))} million${n % 1_000_000 ? ' ' + toWords(n % 1_000_000) : ''}`;
      return `${toWords(Math.floor(n / 1_000_000_000))} billion${n % 1_000_000_000 ? ' ' + toWords(n % 1_000_000_000) : ''}`;
    };

    return toWords(Math.floor(num));
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (index !== null && field !== null) {
      const updated = [...formData.tableData];
      updated[index] = { ...updated[index], [field]: value };
      setFormData((prev) => ({ ...prev, tableData: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addRow = () => {
    const next = formData.tableData.length + 1;
    setFormData((prev) => ({
      ...prev,
      tableData: [...prev.tableData, { srNo: next, date: '', purpose: '', party: '', billNo: '', amount: '' }],
    }));
  };

  const removeRow = (index) => {
    const updated = formData.tableData.filter((_, i) => i !== index).map((r, i) => ({ ...r, srNo: i + 1 }));
    setFormData((prev) => ({ ...prev, tableData: updated }));
  };

  const totalAmount = useMemo(() => {
    return formData.tableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  }, [formData.tableData]);

  const updateAmountWords = (amt) => {
    const n = Number(amt) || 0;
    const words = numberToWords(Math.floor(n));
    setFormData((prev) => ({ ...prev, amountWords: words ? words + ' only' : '' }));
  };

  const handleDownload = async () => {
    try {
      const element = formRef.current;
      // temporarily expand width on canvas to capture full content without scrollbars
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff',
      });
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Reimbursement_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF error', err);
      alert('Could not generate PDF. Try again.');
    }
  };

  // small currency formatter
  const fmt = (v) => {
    if (v === '' || v === null || v === undefined) return '';
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <>
      <style>{`
        .reim-root {
          min-height: 100vh;
          background: linear-gradient(180deg,#f8fbff 0%, #eef7ff 60%);
          padding: 28px 16px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .reim-card {
          width: 100%;
          max-width: 920px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 12px 40px rgba(2,6,23,0.06);
          border: 1px solid rgba(10,20,40,0.03);
        }
        .reim-header {
          text-align: center;
          margin-bottom: 8px;
        }
        .reim-header h2 {
          margin: 4px 0 8px;
          font-size: 1.2rem;
          color: #07102a;
        }
        .field-row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin:8px 0; }
        .field { flex:1 1 220px; display:flex; flex-direction:column; gap:6px; }
        label { font-size:0.9rem; font-weight:700; color:#0f172a; }
        input[type="text"], input[type="date"], input[type="number"], textarea {
          padding: 10px 12px;
          border-radius:8px;
          border: 1px solid #dbe4f2;
          font-size:0.95rem;
        }
        textarea { min-height: 70px; resize: vertical; }

        /* table */
        .reim-table {
          width:100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        .reim-table th, .reim-table td {
          border: 1px solid #e6eef9;
          padding: 8px 10px;
          text-align: left;
          vertical-align: middle;
          font-size: 0.95rem;
        }
        .reim-table th { background: #fbfdff; font-weight:700; color:#0b1220; }
        .row-actions { display:flex; gap:8px; align-items:center; justify-content:center; }

        .btn {
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          font-weight:700;
          cursor:pointer;
        }
        .btn-primary {
          background: linear-gradient(90deg,#2563eb,#7c3aed);
          color: white;
          box-shadow: 0 10px 28px rgba(37,99,235,0.12);
        }
        .btn-ghost { background: transparent; border: 1px solid rgba(10,20,40,0.06); color:#07102a; }

        .add-row { margin-top: 10px; display:inline-block; }

        .summary {
          margin-top: 12px;
          display:flex;
          justify-content: flex-end;
          gap: 12px;
          align-items:center;
          flex-wrap:wrap;
        }
        .summary .line { font-weight:700; color:#0b1220; }

        .signatures { margin-top: 18px; display:flex; gap:20px; justify-content:space-between; align-items:flex-end; }
        .sig-box { width:45%; border-top:1px solid #cbd5e1; padding-top:8px; text-align:center; color:#475569; }

        /* download area */
        .download-area { text-align:center; margin-top: 18px; }

        @media (max-width: 820px) {
          .field-row { flex-direction: column; }
          .signatures { flex-direction:column; gap:10px; }
          .sig-box { width:100%; }
        }

        /* print friendly */
        @media print {
          body * { visibility: hidden; }
          .reim-card, .reim-card * { visibility: visible; }
          .reim-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
        }
      `}</style>

      <div className="reim-root">
        <div className="reim-card">
          <div ref={formRef}>
            <div className="reim-header" aria-hidden>
              <h2>MIT Art, Design & Technology University, Pune</h2>
              <div style={{ color: '#475569', fontSize: 14 }}>Expenditure Details For Reimbursement (Print-friendly)</div>
            </div>

            <div className="field-row" role="group" aria-label="Form details">
              <div className="field">
                <label htmlFor="school">School / College</label>
                <input id="school" name="school" type="text" value={formData.school} onChange={handleChange} placeholder="Enter school or college" />
              </div>

              <div className="field">
                <label htmlFor="date">Date</label>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="staffName">Name of Staff</label>
                <input id="staffName" name="staffName" type="text" value={formData.staffName} onChange={handleChange} placeholder="Staff name" />
              </div>

              <div className="field">
                <label htmlFor="department">Department</label>
                <input id="department" name="department" type="text" value={formData.department} onChange={handleChange} placeholder="Department" />
              </div>

              <div className="field">
                <label htmlFor="designation">Designation</label>
                <input id="designation" name="designation" type="text" value={formData.designation} onChange={handleChange} placeholder="Designation" />
              </div>
            </div>

            <div className="field-row" style={{ marginTop: 6 }}>
              <div className="field">
                <label htmlFor="amount">Amount of Reimbursement (₹)</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    handleChange(e);
                    updateAmountWords(e.target.value);
                  }}
                  placeholder="Total amount"
                />
              </div>

              <div className="field">
                <label htmlFor="amountWords">In Words (auto)</label>
                <input id="amountWords" name="amountWords" type="text" value={formData.amountWords} onChange={handleChange} placeholder="Amount in words" />
              </div>

              <div className="field">
                <label htmlFor="expenseReason">Reimbursement of Expenses made towards</label>
                <input id="expenseReason" name="expenseReason" type="text" value={formData.expenseReason} onChange={handleChange} placeholder="e.g., Conference registration" />
              </div>
            </div>

            <table className="reim-table" aria-label="Expense table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Sr. No.</th>
                  <th style={{ width: 120 }}>Date</th>
                  <th>Purpose</th>
                  <th>Party/Vendor</th>
                  <th style={{ width: 140 }}>Bill No</th>
                  <th style={{ width: 120 }}>Amt (Rs.)</th>
                  <th style={{ width: 90 }} className="no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.tableData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.srNo}</td>
                    <td>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleChange(e, i, 'date')}
                      />
                    </td>
                    <td>
                      <input value={row.purpose} onChange={(e) => handleChange(e, i, 'purpose')} placeholder="Purpose" />
                    </td>
                    <td>
                      <input value={row.party} onChange={(e) => handleChange(e, i, 'party')} placeholder="Party / Vendor" />
                    </td>
                    <td>
                      <input value={row.billNo} onChange={(e) => handleChange(e, i, 'billNo')} placeholder="Bill No" />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={row.amount}
                        onChange={(e) => handleChange(e, i, 'amount')}
                        style={{ width: '100%' }}
                        placeholder="0.00"
                      />
                    </td>
                    <td className="row-actions no-print">
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="btn btn-ghost"
                        title="Remove row"
                        disabled={formData.tableData.length === 1}
                        aria-disabled={formData.tableData.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <button type="button" onClick={addRow} className="btn btn-ghost add-row">+ Add Row</button>
            </div>

            <div className="summary" aria-live="polite">
              <div className="line">Total Expenditure: ₹ {fmt(totalAmount)}</div>
              <div className="line">In Words: {numberToWords(Math.floor(totalAmount)) ? `${numberToWords(Math.floor(totalAmount))} only` : ''}</div>
            </div>

            <div className="signatures">
              <div className="sig-box">
                Prepared by<br />
                <div style={{ marginTop: 8, fontWeight: 800, color: '#0b1220' }}>(Reimbursement Applicant)</div>
              </div>
              <div className="sig-box">
                Approved by<br />
                <div style={{ marginTop: 8, fontWeight: 800, color: '#0b1220' }}>(HOD / Principal / Director)</div>
              </div>
            </div>
          </div>

          <div className="download-area">
            <button type="button" onClick={handleDownload} className="btn btn-primary" aria-label="Download PDF">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReimbursementForm;
  