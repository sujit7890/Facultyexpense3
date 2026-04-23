import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Admin from "./components/Admin";

import ApplicationForm from "./components/ApplicationForm";
import AdvanceSettlementForm from "./components/AdvanceSettlementForm";
import ExpenseReimbursementForm from "./components/ExpenseReimbursementForm";
import WithBillForm from "./components/WithBillForm";
import WithoutBillForm from "./components/WithoutBillForm";

import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Faculty routes */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/application-form"
          element={
            <RequireAuth>
              <ApplicationForm />
            </RequireAuth>
          }
        />

        <Route
          path="/advance-settlement"
          element={
            <RequireAuth>
              <AdvanceSettlementForm />
            </RequireAuth>
          }
        />

        <Route
          path="/expense-reimbursement"
          element={
            <RequireAuth>
              <ExpenseReimbursementForm />
            </RequireAuth>
          }
        />

        <Route
          path="/reimbursement/with-bill"
          element={
            <RequireAuth>
              <WithBillForm />
            </RequireAuth>
          }
        />

        <Route
          path="/without-bill-form"
          element={
            <RequireAuth>
              <WithoutBillForm />
            </RequireAuth>
          }
        />


        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
