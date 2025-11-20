import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import ApplicationForm from './components/ApplicationForm';
import AdvanceSettlementForm from './components/AdvanceSettlementForm';
import ExpenseReimbursementForm from './components/ExpenseReimbursementForm';
import WithBillForm from './components/WithBillForm';
import WithoutBillForm from './components/WithoutBillForm';
import Login from './components/Login';
import Profile from './components/profile';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Default Route — Login Page */}
        <Route path="/" element={<Login />} />

        {/* 🧑‍💼 Admin Dashboard (redirected from login when credentials match) */}
        <Route path="/admin" element={<Admin />} />

        {/* 🏠 Home Dashboard */}
        <Route path="/home" element={<Home />} />

        {/* 👤 Profile Page */}
        <Route path="/profile" element={<Profile />} />

        {/* 🧾 Forms Section */}
        <Route path="/application-form" element={<ApplicationForm />} />
        <Route path="/advance-settlement" element={<AdvanceSettlementForm />} />

        {/* 💸 Expense Reimbursement */}
        <Route path="/expense-reimbursement" element={<ExpenseReimbursementForm />} />
        <Route path="/reimbursement/with-bill" element={<WithBillForm />} />
       <Route path="/without-bill-form" element={<WithoutBillForm />} />

      </Routes>
    </Router>
  );
}

export default App;
