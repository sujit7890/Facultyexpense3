// src/components/WithBillForm.jsx
import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import mitLogo from '../asset/MITADTU.png';
import officeUseImg from '../asset/office-use.png';

const defaultRow = () => ({ srNo: '1', date: '', purpose: '', party: '', billNo: '', amount: '', billFile: null });

const safeParse = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null');
  } catch {
    return null;
  }
};

const WithBillForm = () => {
  const formRef = useRef();

  // initialize state defensively
  const [form, setForm] = useState(() => {
    const saved = safeParse('withBillForm');
    if (!saved || typeof saved !== 'object') {
      return {
        college: '',
        date: '',
        firstName: '',
        lastName: '',
        department: '',
        designation: '',
        gst: '',
        purpose: '',
        table: [defaultRow()],
        customFields: [],
      };
    }

    const table = Array.isArray(saved.table) && saved.table.length ? saved.table : [defaultRow()];
    return {
      ...{
        college: '',
        date: '',
        firstName: '',
        lastName: '',
        department: '',
        designation: '',
        gst: '',
        purpose: '',
        customFields: [],
      },
      ...saved,
      table,
    };
  });

  const [totals, setTotals] = useState({ total: '0.00', gstPercent: 0, gstAmount: '0.00', grandTotal: '0.00' });
  const [objectURLs, setObjectURLs] = useState([]);

  useEffect(() => {
    const basic = safeParse('basicDetails');
    const user = safeParse('userData');
    setForm((prev) => {
      const next = { ...prev };
      if (basic && basic.name && !next.firstName) {
        const parts = basic.name.split(' ');
        next.firstName = parts[0] || next.firstName;
        next.lastName = parts.slice(1).join(' ') || next.lastName;
      }
      if (basic && basic.department && !next.department) next.department = basic.department;
      if (user && user.name && !next.firstName) {
        const parts = user.name.split(' ');
        next.firstName = parts[0] || next.firstName;
        next.lastName = parts.slice(1).join(' ') || next.lastName;
      }
      if (user && user.department && !next.department) next.department = user.department;
      if (!Array.isArray(next.table) || next.table.length === 0) next.table = [defaultRow()];
      if (!Array.isArray(next.customFields)) next.customFields = [];
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('withBillForm', JSON.stringify(form));
    } catch {}
  }, [form]);

  useEffect(() => {
    const rows = Array.isArray(form.table) ? form.table : [];
    const total = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const gstPercent = parseFloat(form.gst) || 0;
    const gstAmount = (total * gstPercent) / 100;
    const grandTotal = total + gstAmount;
    setTotals({
      total: total.toFixed(2),
      gstPercent,
      gstAmount: gstAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
  }, [form.table, form.gst]);

  useEffect(() => {
    return () => {
      objectURLs.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, [objectURLs]);

  // generic field change
  const handleChange = (e, index = null, key = null) => {
    const { name, value } = e.target;
    if (index !== null && key !== null) {
      const table = Array.isArray(form.table) ? [...form.table] : [defaultRow()];
      table[index] = { ...table[index], [key]: value };
      setForm({ ...form, table });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // file handling with object URL preview
  const handleFileChange = (index, file) => {
    const table = Array.isArray(form.table) ? [...form.table] : [defaultRow()];
    if (!file) {
      const prev = table[index]?.billFile;
      if (prev?.url) {
        try {
          URL.revokeObjectURL(prev.url);
          setObjectURLs((arr) => arr.filter((u) => u !== prev.url));
        } catch {}
      }
      table[index].billFile = null;
      setForm({ ...form, table });
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectURLs((arr) => [...arr, url]);
    const isImage = file.type && file.type.startsWith('image/');
    table[index].billFile = { name: file.name, size: file.size, type: file.type, url, isImage };
    setForm({ ...form, table });
  };

  const addRow = () => {
    const table = Array.isArray(form.table) ? [...form.table] : [];
    const nextNo = (table.length + 1).toString();
    table.push({ ...defaultRow(), srNo: nextNo });
    setForm({ ...form, table });
  };

  const removeRow = (index) => {
    const table = Array.isArray(form.table) ? [...form.table] : [];
    if (index < 0 || index >= table.length) return;
    const removed = table.splice(index, 1)[0];
    if (removed && removed.billFile && removed.billFile.url) {
      try {
        URL.revokeObjectURL(removed.billFile.url);
        setObjectURLs((arr) => arr.filter((u) => u !== removed.billFile.url));
      } catch {}
    }
    const reIndexed = table.map((r, i) => ({ ...r, srNo: (i + 1).toString() }));
    setForm({ ...form, table: reIndexed.length ? reIndexed : [defaultRow()] });
  };

  // custom fields
  const addCustomField = () => {
    const id = `cf_${Date.now()}`;
    const cf = Array.isArray(form.customFields) ? [...form.customFields, { id, label: '', value: '' }] : [{ id, label: '', value: '' }];
    setForm({ ...form, customFields: cf });
  };
  const updateCustomField = (id, key, val) => {
    const cf = Array.isArray(form.customFields)
      ? form.customFields.map((f) => (f.id === id ? { ...f, [key]: val } : f))
      : [];
    setForm({ ...form, customFields: cf });
  };
  const removeCustomField = (id) => {
    const cf = Array.isArray(form.customFields) ? form.customFields.filter((f) => f.id !== id) : [];
    setForm({ ...form, customFields: cf });
  };

  const generatePDF = async () => {
    if (!formRef.current) return;
    try {
      await new Promise((r) => setTimeout(r, 120));
      await html2pdf()
        .set({
          margin: [10, 10],
          filename: 'Reimbursement_With_Bill.pdf',
          html2canvas: { scale: 2, useCORS: true, scrollY: 0, allowTaint: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(formRef.current)
        .save();
    } catch (err) {
      console.error('PDF error', err);
      alert('Failed to generate PDF. Try again.');
    }
  };

  const goBack = () => window.history.back();

  const tableSafe = Array.isArray(form.table) && form.table.length ? form.table : [defaultRow()];
  const customFieldsSafe = Array.isArray(form.customFields) ? form.customFields : [];

  return (
    <>
      <style>{`
        /* ===== layout & card ===== */
        .wb-container { min-height:100vh; padding:24px; background: linear-gradient(180deg,#f8fbff,#eef7ff); display:flex; justify-content:center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .wb-card { width:100%; max-width:1100px; background:#fff; border-radius:12px; padding:18px; box-shadow:0 12px 40px rgba(2,6,23,0.06); }
        .wb-header { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:12px; }
        .wb-logo { height:84px; }

        /* two-column layout */
        .wb-grid { display:flex; gap:18px; flex-wrap:wrap; }
        .wb-left { flex:1 1 640px; min-width: 420px; }
        .wb-right { width:360px; flex:0 0 360px; min-width: 260px; }

        /* form field grid alignment */
        .wb-row { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin-top:12px; }
        .wb-field { flex:1 1 180px; display:flex; flex-direction:column; gap:6px; }

        label { font-weight:700; color:#0f172a; font-size:0.95rem; margin-bottom:4px; }
        input[type="text"], input[type="date"], input[type="number"], select {
          padding:8px 10px;
          border-radius:8px;
          border:1px solid #dbe4f2;
          font-size:15px;
          box-sizing: border-box;
          width:100%;
          background: #fff;
        }

        /* ===== editable table ===== */
        .wb-table { width:100%; border-collapse:collapse; margin-top:12px; table-layout: fixed; }
        .wb-table thead th, .wb-table tbody td { border:1px solid #e6eef9; padding:8px; vertical-align:middle; }
        .wb-table thead th { background:#fbfdff; font-weight:700; color:#0b1220; text-align:center; }
        .wb-table input { width:100%; box-sizing: border-box; padding:6px 8px; border-radius:6px; border:1px solid #e6eef9; }

        /* fixed column widths using classes and colgroup */
        .col-sr { width:60px; }
        .col-date { width:120px; }
        .col-purpose { width:1fr; } /* flexible */
        .col-party { width:160px; }
        .col-billno { width:110px; }
        .col-amount { width:120px; }
        .col-upload { width:150px; }
        .col-action { width:90px; }

        .no-print { /* hide controls in PDF */ }

        .file-info { font-size:12px; color:#475569; margin-top:6px; text-align:center; }

        .btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:700; }
        .btn-primary { background: linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; }
        .btn-ghost { background:transparent; border:1px solid rgba(10,20,40,0.06); }

        .add-row-btn { margin-top:10px; background:#4f46e5; color:white; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; }

        /* ===== preview table ===== */
        .preview { margin-top:18px; padding:16px; background:#fff; border-radius:8px; border:1px solid #eef3ff; }
        .preview .meta { display:flex; gap:12px; flex-wrap:wrap; }
        .preview-table { width:100%; border-collapse:collapse; margin-top:12px; table-layout: fixed; border:1px solid #e6eef9; }
        .preview-table th, .preview-table td { padding:8px; border:1px solid #eef3ff; text-align:left; vertical-align:top; }
        .preview-table th { background:#fbfdff; font-weight:700; text-align:center; }

        .preview .col-sr, .preview .col-date, .preview .col-purpose, .preview .col-party, .preview .col-billno, .preview .col-amount, .preview .col-upload {
          /* keep same widths as editable table */
        }

        .thumb { display:block; max-width:120px; max-height:90px; object-fit:cover; border-radius:6px; border:1px solid #eceff6; }

        /* custom fields */
        .custom-field { display:flex; gap:8px; margin-top:8px; align-items:center; }
        .custom-field input { padding:6px 8px; border:1px solid #e6eef9; border-radius:6px; }

        /* responsive */
        @media (max-width: 960px) {
          .wb-right { width:100%; flex-basis:100%; }
          .wb-left { width:100%; }
        }

        @media print {
          .no-print, button { display:none !important; }
          .wb-card { box-shadow:none; border:none; padding:0; }
          input[type="file"] { display:none !important; }
          .add-row-btn, .btn-ghost { display:none !important; }
        }
      `}</style>

      <div className="wb-container">
        <div className="wb-card" role="main">
          <button className="btn btn-ghost no-print" onClick={goBack} style={{ marginBottom: 12 }}>← Back</button>

          <div className="wb-header">
            <img src={mitLogo} alt="MIT Logo" className="wb-logo" />
          </div>

          <div className="wb-grid">
            <div className="wb-left">
              {/* basic details */}
              <div className="wb-row" role="group" aria-label="Basic details">
                <div className="wb-field">
                  <label>School / College</label>
                  <input name="college" value={form.college} onChange={handleChange} placeholder="School or college" />
                </div>
                <div className="wb-field">
                  <label>Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="wb-field">
                  <label>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
                </div>
                <div className="wb-field">
                  <label>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
                </div>
                <div className="wb-field">
                  <label>Department</label>
                  <input name="department" value={form.department} onChange={handleChange} placeholder="Department" />
                </div>
                <div className="wb-field">
                  <label>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
                </div>
                <div className="wb-field">
                  <label>GST (%)</label>
                  <input name="gst" value={form.gst} onChange={handleChange} placeholder="e.g., 18" />
                </div>
                <div style={{ flex: '1 1 100%' }} className="wb-field">
                  <label>Purpose</label>
                  <input name="purpose" value={form.purpose} onChange={handleChange} placeholder="Purpose of expense" />
                </div>
              </div>

              {/* editable table with colgroup that matches preview table */}
              <table className="wb-table" aria-label="Expense table">
                <colgroup>
                  <col className="col-sr" />
                  <col className="col-date" />
                  <col className="col-purpose" />
                  <col className="col-party" />
                  <col className="col-billno" />
                  <col className="col-amount" />
                  <col className="col-upload" />
                  <col className="col-action" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="col-sr">Sr. No</th>
                    <th className="col-date">Date</th>
                    <th className="col-purpose">Purpose</th>
                    <th className="col-party">Party / Vendor</th>
                    <th className="col-billno">Bill No</th>
                    <th className="col-amount">Amount (₹)</th>
                    <th className="col-upload no-print">Upload</th>
                    <th className="col-action no-print">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSafe.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>{row.srNo}</td>
                      <td><input type="date" value={row.date || ''} onChange={(e) => handleChange(e, idx, 'date')} /></td>
                      <td><input value={row.purpose || ''} onChange={(e) => handleChange(e, idx, 'purpose')} placeholder="Purpose" /></td>
                      <td><input value={row.party || ''} onChange={(e) => handleChange(e, idx, 'party')} placeholder="Vendor" /></td>
                      <td><input value={row.billNo || ''} onChange={(e) => handleChange(e, idx, 'billNo')} placeholder="Bill no" /></td>
                      <td><input type="number" value={row.amount || ''} onChange={(e) => handleChange(e, idx, 'amount')} placeholder="0.00" /></td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <input type="file" style={{ display: 'block', margin: '0 auto' }} onChange={(e) => handleFileChange(idx, e.target.files ? e.target.files[0] : null)} />
                        <div className="file-info">{row.billFile ? row.billFile.name : ''}</div>
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button className="btn btn-ghost" onClick={() => removeRow(idx)} disabled={tableSafe.length === 1}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 10 }} className="no-print">
                <button className="add-row-btn" onClick={addRow}>+ Add Row</button>
              </div>

              {/* additional fields */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Additional Fields</strong>
                  <div className="no-print">
                    <button className="btn btn-ghost" onClick={addCustomField}>+ Add Field</button>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  {customFieldsSafe.length === 0 && <div style={{ color: '#475569' }}>No additional fields</div>}
                  {customFieldsSafe.map((f) => (
                    <div key={f.id} className="custom-field">
                      <input value={f.label} onChange={(e) => updateCustomField(f.id, 'label', e.target.value)} placeholder="Label" />
                      <input value={f.value} onChange={(e) => updateCustomField(f.id, 'value', e.target.value)} placeholder="Value" />
                      <button className="btn btn-ghost no-print" onClick={() => removeCustomField(f.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="wb-right">
              <div style={{ background: '#fff', padding: 14, borderRadius: 8, boxShadow: '0 10px 30px rgba(2,6,23,0.04)' }}>
                <strong>Totals</strong>
                <div style={{ marginTop: 8 }}>Total: ₹{totals.total}</div>
                <div style={{ marginTop: 6 }}>GST: {totals.gstPercent}%</div>
                <div style={{ marginTop: 6 }}>GST Amt: ₹{totals.gstAmount}</div>
                <div style={{ marginTop: 6, fontWeight: 800 }}>Grand Total: ₹{totals.grandTotal}</div>

                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={generatePDF}>Download PDF</button>
                </div>
              </div>

              <div style={{ marginTop: 12, background: '#fff', padding: 12, borderRadius: 8 }}>
                <strong>Preview note</strong>
                <div style={{ marginTop: 8, color: '#475569' }}>The printed PDF content is the preview area below — images uploaded will appear as thumbnails where possible.</div>
              </div>
            </div>
          </div>

          {/* printable preview: uses colgroup with same widths as editable table */}
          <div ref={formRef} className="preview" aria-label="Preview">
            <div style={{ textAlign: 'center' }}>
              <img src={mitLogo} alt="MIT Logo" style={{ height: 84 }} />
              <div style={{ fontWeight: 800, marginTop: 6 }}>MIT Art, Design & Technology University, Pune</div>
              <div style={{ color: '#475569', marginTop: 6 }}>Expenditure Details (With Bill)</div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px' }}><strong>College:</strong><div>{form.college || '—'}</div></div>
              <div style={{ flex: '1 1 120px' }}><strong>Date:</strong><div>{form.date || '—'}</div></div>
              <div style={{ flex: '1 1 220px' }}><strong>Applicant:</strong><div>{`${form.firstName || ''} ${form.lastName || ''}`.trim() || '—'}</div></div>
            </div>

            <hr style={{ margin: '12px 0' }} />

            <div style={{ overflowX: 'auto' }}>
              <table className="preview-table" border="1">
                <colgroup>
                  <col style={{ width: 60 }} />
                  <col style={{ width: 120 }} />
                  <col />
                  <col style={{ width: 160 }} />
                  <col style={{ width: 110 }} />
                  <col style={{ width: 120 }} />
                  <col style={{ width: 150 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="col-sr">Sr</th>
                    <th className="col-date">Date</th>
                    <th className="col-purpose">Purpose</th>
                    <th className="col-party">Party</th>
                    <th className="col-billno">Bill No</th>
                    <th className="col-amount">Amt (₹)</th>
                    <th className="col-upload">Bill (preview)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableSafe.map((r, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center', padding: 6 }}>{r.srNo}</td>
                      <td style={{ padding: 6 }}>{r.date || '—'}</td>
                      <td style={{ padding: 6 }}>{r.purpose || '—'}</td>
                      <td style={{ padding: 6 }}>{r.party || '—'}</td>
                      <td style={{ padding: 6 }}>{r.billNo || '—'}</td>
                      <td style={{ padding: 6, textAlign: 'right' }}>{r.amount ? Number(r.amount).toFixed(2) : '0.00'}</td>
                      <td style={{ padding: 6, textAlign: 'center' }}>
                        {r.billFile ? (
                          r.billFile.isImage ? (
                            <img src={r.billFile.url} alt={r.billFile.name} className="thumb" />
                          ) : (
                            <div style={{ fontSize: 12 }}>{r.billFile.name}</div>
                          )
                        ) : (
                          '—'
                        )}
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
                    {customFieldsSafe.map((f) => (
                      <div key={f.id} style={{ marginBottom: 6 }}><strong>{f.label || 'Field'}:</strong> <span>{f.value || '—'}</span></div>
                    ))}
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

          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }} className="no-print">
            <button className="btn btn-ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Top</button>
            <button className="btn btn-primary" onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithBillForm;
