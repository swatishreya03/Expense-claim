import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Login from './Login';
import HRDashboard from './components/HRDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './Css/Login.css';
import './Css/EmployeeDashboard.css';
import AddClaimForm from './components/AddClaimForm';
import AMDashboard from './components/AccountManagerDashboard';
import './Css/AddClaimForm.css';
import './Css/HRDashboard.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee/add-claim" element={<AddClaimForm />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/account-manager" element={<AMDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
