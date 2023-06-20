import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/AddClaimForm" element={<AddClaimForm />} />
        <Route path="/ed" element={<EmployeeDashboard/>} />
        <Route path="/hrd" element={<HRDashboard/>} />
        <Route path="/amd" element={<AMDashboard/>} />
        
      </Routes>
    </Router>

  );
};

export default App;
