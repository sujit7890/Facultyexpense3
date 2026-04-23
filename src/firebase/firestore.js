import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

// 1️⃣ Application for Advance
export const submitAdvanceApplication = async (formData, user) => {
  try {
    await addDoc(collection(db, "advance_applications"), {
      userId: user.uid,
      userEmail: user.email,
      formData,
      status: "pending",
      submittedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// 2️⃣ Advance Settlement (already used)
export const submitAdvanceSettlement = async (formData, user) => {
  try {
    await addDoc(collection(db, "advance_settlements"), {
      userId: user.uid,
      userEmail: user.email,
      formData,
      status: "pending",
      submittedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// 3️⃣ Expense Reimbursement
export const submitReimbursement = async (formData, user) => {
  try {
    await addDoc(collection(db, "reimbursements"), {
      userId: user.uid,
      userEmail: user.email,
      formData,
      status: "pending",
      submittedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
