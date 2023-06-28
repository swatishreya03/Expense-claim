import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Login from './Login';
import HRDashboard from './components/HRDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AddClaimForm from './components/AddClaimForm';
import AMDashboard from './components/AccountManagerDashboard';
import AccountsTeam from './components/AccountsTeam';
import Topbar from './components/Topbar';
import Admin from './components/Admin';


import './css/AddClaimForm.css';
import './css/HRDashboard.css';
import './css/Login.css';
import './css/EmployeeDashboard.css';
import './App.css'
import './css/Topbar.css';
import './img/logo/Logo.jpeg';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee/add-claim" element={<AddClaimForm />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/account-manager" element={<AMDashboard />} />
        <Route path="/accounts" element={<AccountsTeam />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </Router>
  );
};

export default App;
