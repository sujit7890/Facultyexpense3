
import React, { useRef, useState, useEffect, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import mitLogo from '../asset/MITADTU.png';
import officeUseImg from '../asset/office-use.png';

// helper
const defaultRow = () => ({ srNo: '1', date: '', expenditure: '', amount: '', billFile: null });
const safeParse = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null');
  } catch {
    return null;
  }
};

export default function WithoutBillForm() {
  const formRef = useRef();

  // init defensively
  const [form, setForm] = useState(() => {
    const saved = safeParse('withoutBillForm');
    if (!saved || typeof saved !== 'object') {
      return {
        college: '',
        date: '',
        staffName: '',
        designation: '',
        department: '',
        advanceAmount: '',
        advanceDate: '',
        purpose: '',
        table: [defaultRow()],
        customFields: [],
      };
    }
    const table = Array.isArray(saved.table) && saved.table.length ? saved.table : [defaultRow()];
    const customFields = Array.isArray(saved.customFields) ? saved.customFields : [];
    return { ...{
      college: '',
      date: '',
      staffName: '',
      designation: '',
      department: '',
      advanceAmount: '',
      advanceDate: '',
      purpose: '',
      table: [defaultRow()],
      customFields: [],
    }, ...saved, table, customFields };
  });

  // object URLs for previews
  const [objectURLs, setObjectURLs] = useState([]);

  // prefill from local basic/user data
  useEffect(() => {
    const basic = safeParse('basicDetails');
    const user = safeParse('userData');
    setForm(prev => {
      const next = { ...prev };
      if (basic && basic.name && !next.staffName) next.staffName = basic.name;
      if (basic && basic.department && !next.department) next.department = basic.department;
      if (user && user.name && !next.staffName) next.staffName = user.name;
      if (user && user.department && !next.department) next.department = user.department;
      if (!Array.isArray(next.table) || next.table.length === 0) next.table = [defaultRow()];
      if (!Array.isArray(next.customFields)) next.customFields = [];
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem('withoutBillForm', JSON.stringify(form));
    } catch {}
  }, [form]);

  // clean up object URLs on unmount
  useEffect(() => {
    return () => {
      objectURLs.forEach(u => {
        try { URL.revokeObjectURL(u); } catch {}
      });
    };
  }, [objectURLs]);

  // totals
  const totalExpenditure = useMemo(() => {
    const rows = Array.isArray(form.table) ? form.table : [];
    return rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  }, [form.table]);

  const remainingBalance = useMemo(() => (parseFloat(form.advanceAmount) || 0) - totalExpenditure, [form.advanceAmount, totalExpenditure]);
  const excessAmount = useMemo(() => totalExpenditure - (parseFloat(form.advanceAmount) || 0), [form.advanceAmount, totalExpenditure]);

  // change handlers
  const handleChange = (e, idx = null, key = null) => {
    const { name, value } = e.target;
    if (idx !== null && key !== null) {
      const table = Array.isArray(form.table) ? [...form.table] : [defaultRow()];
      table[idx] = { ...table[idx], [key]: value };
      setForm(prev => ({ ...prev, table }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // file upload with URL preview
  const handleFileChange = (index, file) => {
    const table = Array.isArray(form.table) ? [...form.table] : [defaultRow()];
    // revoke old
    const prev = table[index]?.billFile;
    if (prev && prev.url) {
      try { URL.revokeObjectURL(prev.url); setObjectURLs(arr => arr.filter(u => u !== prev.url)); } catch {}
    }

    if (!file) {
      table[index].billFile = null;
      setForm(prev => ({ ...prev, table }));
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectURLs(arr => [...arr, url]);
    const isImage = file.type && file.type.startsWith('image/');
    table[index].billFile = { name: file.name, size: file.size, type: file.type, url, isImage };
    setForm(prev => ({ ...prev, table }));
  };

  const addRow = () => {
    const table = Array.isArray(form.table) ? [...form.table] : [];
    const nextNo = (table.length + 1).toString();
    table.push({ ...defaultRow(), srNo: nextNo });
    setForm(prev => ({ ...prev, table }));
  };

  const removeRow = (index) => {
    const table = Array.isArray(form.table) ? [...form.table] : [];
    if (index < 0 || index >= table.length) return;
    const [removed] = table.splice(index, 1);
    if (removed && removed.billFile && removed.billFile.url) {
      try { URL.revokeObjectURL(removed.billFile.url); setObjectURLs(arr => arr.filter(u => u !== removed.billFile.url)); } catch {}
    }
    const reIndexed = table.length ? table.map((r, i) => ({ ...r, srNo: (i + 1).toString() })) : [defaultRow()];
    setForm(prev => ({ ...prev, table: reIndexed }));
  };

  const resetForm = () => {
    setForm({
      college: '',
      date: '',
      staffName: '',
      designation: '',
      department: '',
      advanceAmount: '',
      advanceDate: '',
      purpose: '',
      table: [defaultRow()],
      customFields: [],
    });
    try { localStorage.removeItem('withoutBillForm'); } catch {}
  };

  // custom fields
  const addCustomField = () => {
    const id = `cf_${Date.now()}`;
    const next = Array.isArray(form.customFields) ? [...form.customFields, { id, label: '', value: '' }] : [{ id, label: '', value: '' }];
    setForm(prev => ({ ...prev, customFields: next }));
  };
  const updateCustomField = (id, key, val) => {
    const next = (Array.isArray(form.customFields) ? form.customFields : []).map(f => f.id === id ? { ...f, [key]: val } : f);
    setForm(prev => ({ ...prev, customFields: next }));
  };
  const removeCustomField = (id) => {
    const next = (Array.isArray(form.customFields) ? form.customFields : []).filter(f => f.id !== id);
    setForm(prev => ({ ...prev, customFields: next }));
  };

  const fmtINR = (v) => {
    const n = Number(v || 0);
    if (!Number.isFinite(n)) return v;
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // PDF generation (uses on-page preview area)
  const generatePDF = async () => {
    if (!formRef.current) return;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Reimbursement_Without_Bill_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    try {
      // small delay to ensure images render
      await new Promise(r => setTimeout(r, 120));
      await html2pdf().set(opt).from(formRef.current).save();
    } catch (err) {
      console.error('PDF error', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // ensure safe arrays for render
  const tableSafe = Array.isArray(form.table) && form.table.length ? form.table : [defaultRow()];
  const customFieldsSafe = Array.isArray(form.customFields) ? form.customFields : [];

  return (
    <>
      <style>{`
        .wb-root { min-height:100vh; padding:28px 14px; background: linear-gradient(180deg,#f8fbff 0%, #eef7ff 60%); display:flex; justify-content:center; box-sizing:border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .wb-card { width:100%; max-width:1000px; background:#fff; border-radius:12px; padding:20px; box-shadow:0 14px 40px rgba(2,6,23,0.06); border:1px solid rgba(10,20,40,0.03); }
        .header { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:12px; }
        .mit-logo { height:72px; width:auto; border-radius:8px; }
        h2,h3 { text-align:center; margin:6px 0; color:#07102a; }
        .form-row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin:10px 0; }
        .field { flex:1 1 220px; display:flex; flex-direction:column; gap:6px; }
        label { font-weight:700; color:#0f172a; font-size:0.95rem; }
        input[type="text"], input[type="date"], input[type="number"], select { padding:8px 10px; border-radius:8px; border:1px solid #dbe4f2; font-size:15px; }
        .expense-table { width:100%; border-collapse:collapse; margin-top:16px; }
        .expense-table th, .expense-table td { padding:8px; border:1px solid #e6eef9; text-align:center; vertical-align:middle; }
        .expense-table th { background:#fbfdff; font-weight:700; color:#0b1220; }
        .file-info { font-size:12px; color:#475569; margin-top:6px; }
        .controls { display:flex; gap:10px; align-items:center; margin-top:12px; }
        .btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:700; }
        .btn-primary { background: linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; }
        .btn-ghost { background:transparent; border:1px solid rgba(10,20,40,0.06); color:#07102a; }
        .add-row-btn { background:#4f46e5; color:#fff; padding:8px 12px; border-radius:8px; border:none; }
        .summary { margin-top:16px; display:flex; flex-direction:column; gap:6px; align-items:flex-end; font-weight:700; color:#0b1220; }
        .sig-row { display:flex; gap:20px; justify-content:space-between; margin-top:20px; align-items:flex-end; }
        .sig-box { width:48%; border-top:1px solid #cbd5e1; padding-top:8px; text-align:center; color:#475569; }
        .office-use { margin-top:16px; text-align:center; }
        .preview-area { margin-top:18px; padding:16px; background:#fff; border-radius:8px; border:1px solid #eef3ff; }
        .custom-field { display:flex; gap:8px; margin-top:8px; align-items:center; }
        .no-print { }
        @media (max-width:920px) { .sig-row { flex-direction:column; gap:12px; align-items:stretch; } .field { flex:1 1 100%; } .mit-logo { height:64px; } }
        @media print { .controls, .download, button, .no-print { display:none !important; } .wb-card { box-shadow:none; border:none; padding:0; } }
      `}</style>

      <div className="wb-root">
        <div className="wb-card">
          <div className="header"><img src={mitLogo} alt="MIT Logo" className="mit-logo" /></div>

          <h2>MIT Art, Design & Technology University, Pune</h2>
          <h3>Expenditure Details for Reimbursement (Without Bill)</h3>

          <div className="form-row" role="group" aria-label="basic details">
            <div className="field"><label>School / College</label><input name="college" type="text" value={form.college} onChange={handleChange} placeholder="School or college" /></div>
            <div className="field"><label>Date</label><input name="date" type="date" value={form.date} onChange={handleChange} /></div>
            <div className="field"><label>Name of Staff</label><input name="staffName" type="text" value={form.staffName} onChange={handleChange} placeholder="Staff name" /></div>
            <div className="field"><label>Designation</label><input name="designation" type="text" value={form.designation} onChange={handleChange} placeholder="Designation" /></div>
            <div className="field"><label>Department</label><input name="department" type="text" value={form.department} onChange={handleChange} placeholder="Department" /></div>
          </div>

          <div className="form-row" style={{ marginTop: 8 }}>
            <div className="field"><label>Advance Rs.</label><input name="advanceAmount" type="number" value={form.advanceAmount} onChange={handleChange} placeholder="0.00" /></div>
            <div className="field"><label>Date of Advance Taken</label><input name="advanceDate" type="date" value={form.advanceDate} onChange={handleChange} /></div>
            <div className="field" style={{ flex: '1 1 100%' }}><label>Purpose of Advance</label><input name="purpose" type="text" value={form.purpose} onChange={handleChange} placeholder="Purpose of advance" /></div>
          </div>

          <table className="expense-table" aria-label="expense table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Sr. No</th>
                <th style={{ width: 120 }}>Date</th>
                <th>Expenditure Purpose</th>
                <th style={{ width: 140 }}>Amount (₹)</th>
                <th className="no-print" style={{ width: 180 }}>Upload Bill (if any)</th>
              </tr>
            </thead>
            <tbody>
              {tableSafe.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.srNo}</td>
                  <td><input type="date" value={row.date || ''} onChange={(e) => handleChange(e, idx, 'date')} /></td>
                  <td><input value={row.expenditure || ''} onChange={(e) => handleChange(e, idx, 'expenditure')} placeholder="Purpose" /></td>
                  <td><input type="number" value={row.amount || ''} onChange={(e) => handleChange(e, idx, 'amount')} placeholder="0.00" /></td>
                  <td className="no-print">
                    <input type="file" onChange={(e) => handleFileChange(idx, e.target.files ? e.target.files[0] : null)} />
                    <div className="file-info">{row.billFile ? row.billFile.name : ''}</div>
                    <div style={{ marginTop: 8 }}>
                      <button type="button" className="btn btn-ghost" onClick={() => removeRow(idx)} disabled={tableSafe.length === 1}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="controls no-print" style={{ marginTop: 12 }}>
            <button type="button" className="add-row-btn" onClick={addRow}>+ Add Row</button>
            <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ marginLeft: 8 }}>Clear Draft</button>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Additional Fields</strong>
              <div className="no-print"><button className="btn btn-ghost" onClick={addCustomField}>+ Add Field</button></div>
            </div>
            <div style={{ marginTop: 8 }}>
              {customFieldsSafe.length === 0 && <div style={{ color: '#475569' }}>No additional fields</div>}
              {customFieldsSafe.map(cf => (
                <div key={cf.id} className="custom-field">
                  <input value={cf.label} onChange={(e) => updateCustomField(cf.id, 'label', e.target.value)} placeholder="Label" />
                  <input value={cf.value} onChange={(e) => updateCustomField(cf.id, 'value', e.target.value)} placeholder="Value" />
                  <button className="btn btn-ghost no-print" onClick={() => removeCustomField(cf.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="summary" aria-live="polite">
            <div>Total Expenditure: ₹ {fmtINR(totalExpenditure)}</div>
            <div>Advance Amount: ₹ {fmtINR(form.advanceAmount || 0)}</div>
            <div>Remaining Balance: ₹ {fmtINR(remainingBalance > 0 ? remainingBalance : 0)}</div>
            <div>Excess of Advance: ₹ {fmtINR(excessAmount > 0 ? excessAmount : 0)}</div>
          </div>

          <div className="sig-row">
            <div className="sig-box">Prepared by<br /><div style={{ marginTop: 8, fontWeight: 800, color: '#0b1220' }}>(Reimbursement Applicant)</div></div>
            <div className="sig-box">Approved by<br /><div style={{ marginTop: 8, fontWeight: 800, color: '#0b1220' }}>(HOD / Principal / Director)</div></div>
          </div>

          <div className="office-use" style={{ marginTop: 16, textAlign: 'center' }}>
            <img src={officeUseImg} alt="Office Use Only" style={{ maxWidth: 720, width: '100%' }} />
          </div>

          {/* preview area used for PDF rendering */}
          <div ref={formRef} className="preview-area" aria-label="Printable preview">
            <div style={{ textAlign: 'center' }}>
              <img src={mitLogo} alt="MIT Logo" style={{ height: 84 }} />
              <div style={{ fontWeight: 800, marginTop: 8 }}>MIT Art, Design & Technology University, Pune</div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px' }}><strong>College:</strong><div>{form.college || '—'}</div></div>
              <div style={{ flex: '1 1 120px' }}><strong>Date:</strong><div>{form.date || '—'}</div></div>
              <div style={{ flex: '1 1 220px' }}><strong>Applicant:</strong><div>{form.staffName || '—'}</div></div>
            </div>

            <hr style={{ margin: '12px 0' }} />

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
                <thead style={{ background: '#fbfdff' }}>
                  <tr>
                    <th style={{ padding: 6 }}>Sr</th>
                    <th style={{ padding: 6 }}>Date</th>
                    <th style={{ padding: 6 }}>Purpose</th>
                    <th style={{ padding: 6 }}>Amt (₹)</th>
                    <th style={{ padding: 6 }}>Bill (preview)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSafe.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: 6, textAlign: 'center' }}>{r.srNo}</td>
                      <td style={{ padding: 6 }}>{r.date || '—'}</td>
                      <td style={{ padding: 6 }}>{r.expenditure || '—'}</td>
                      <td style={{ padding: 6, textAlign: 'right' }}>{r.amount ? Number(r.amount).toFixed(2) : '0.00'}</td>
                      <td style={{ padding: 6, textAlign: 'center' }}>
                        {r.billFile ? (r.billFile.isImage ? <img src={r.billFile.url} alt={r.billFile.name} style={{ maxWidth: 120, maxHeight: 90, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ fontSize: 12 }}>{r.billFile.name}</div>) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {customFieldsSafe.length > 0 && (
              <>
                <hr style={{ marginTop: 12 }} />
                <div><strong>Additional Information</strong>
                  <div style={{ marginTop: 8 }}>
                    {customFieldsSafe.map(f => <div key={f.id} style={{ marginBottom: 6 }}><strong>{f.label || 'Field'}:</strong> <span>{f.value || '—'}</span></div>)}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <div><strong>Prepared by:</strong><div style={{ marginTop: 6 }}>(Applicant)</div></div>
              <div><strong>Approved by:</strong><div style={{ marginTop: 6 }}>(HOD / Principal)</div></div>
            </div>

            <div style={{ marginTop: 12 }}>
              <img src={officeUseImg} alt="Office Use" style={{ width: '100%', maxWidth: 760 }} />
            </div>
          </div>

          <div className="download no-print" style={{ textAlign: 'center', marginTop: 12 }}>
            <button className="btn btn-primary" onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      </div>
    </>
  );
}
