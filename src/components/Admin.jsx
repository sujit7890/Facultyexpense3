import React, { useEffect, useState } from "react";
import "./styles/Admin.css";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

const db = getFirestore(app);

function Admin() {
  const [applications, setApplications] = useState([]);
  const [settlements, setSettlements] = useState([]);

  
  useEffect(() => {
    const fetchAll = async () => {
      const appSnap = await getDocs(collection(db, "advance_applications"));
      const setSnap = await getDocs(collection(db, "advance_settlements"));

      setApplications(appSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSettlements(setSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchAll();
  }, []);

  // Update status
  const updateStatus = async (collectionName, id, status) => {
    await updateDoc(doc(db, collectionName, id), { status });

    if (collectionName === "advance_applications") {
      setApplications(prev =>
        prev.map(a => (a.id === id ? { ...a, status } : a))
      );
    } else {
      setSettlements(prev =>
        prev.map(s => (s.id === id ? { ...s, status } : s))
      );
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* ================= ADVANCE APPLICATIONS ================= */}
      <h2>Advance Applications</h2>

      {applications.map(a => (
        <div className="admin-card" key={a.id}>
          <div className="card-header">
            <span className="name">
              {a.formData?.name || "Faculty"}
            </span>
            <span className="amount">
              ₹{a.formData?.amount}
            </span>
          </div>

          <div className="details">
            <div>Department: {a.formData?.department}</div>
            <div>Purpose: {a.formData?.purpose}</div>
            <div>Justification: {a.formData?.justification || "—"}</div>
            <div>Expected Settlement Date: {a.formData?.date || "—"}</div>
            <div className={`status ${a.status}`}>
              Status: {a.status}
            </div>
          </div>

          <div className="actions">
            <button
              className="approve"
              disabled={a.status === "approved"}
              onClick={() =>
                updateStatus("advance_applications", a.id, "approved")
              }
            >
              Approve
            </button>

            <button
              className="reject"
              disabled={a.status === "rejected"}
              onClick={() =>
                updateStatus("advance_applications", a.id, "rejected")
              }
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <hr />

      {/* ================= ADVANCE SETTLEMENTS ================= */}
      <h2>Advance Settlements</h2>

      {settlements.map(s => (
        <div className="admin-card" key={s.id}>
          <div className="card-header">
            <span className="name">
              {s.formData?.firstName} {s.formData?.lastName}
            </span>
            <span className="amount">
              ₹{s.formData?.amount}
            </span>
          </div>

          <div className="details">
            <div>Designation: {s.formData?.designation}</div>
            <div>Details: {s.formData?.details}</div>
            <div className={`status ${s.status}`}>
              Status: {s.status}
            </div>
          </div>

          <div className="actions">
            <button
              className="approve"
              disabled={s.status === "approved"}
              onClick={() =>
                updateStatus("advance_settlements", s.id, "approved")
              }
            >
              Approve
            </button>

            <button
              className="reject"
              disabled={s.status === "rejected"}
              onClick={() =>
                updateStatus("advance_settlements", s.id, "rejected")
              }
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;
