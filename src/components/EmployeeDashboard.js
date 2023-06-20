import React, { useState } from 'react';
import '../Css/EmployeeDashboard.css'; // Import the CSS file for styling
import AddClaimForm from './AddClaimForm';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { reject } from 'q';


const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);


  // Function to handle claim form submission
  const handleClaimSubmission = (category, amount, invoice, Mail) => {
    const newClaim = {
      category,
      amount,
      invoice,
      Mail,
      statusHR: false,
      statusAccM: false,
      rejected: false
    };

    setClaims(prevClaims => [...prevClaims, newClaim]);
  };

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>

      <Link to="/employee/add-claim" className="add-claim-button">
        Add New Claim
      </Link>

      <h2>Previous Claims</h2>
      <table className="claims-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Invoice</th>
            <th>Mail</th>
            <th>Status by HR</th>
            <th>Status by Acc. M.</th>
          </tr>
        </thead>
        <tbody>
          {claims && claims.map((claim, index) => {
            return (
              <tr key={index}>
                <td>{claim.Category}</td>
                <td>{claim.Amount}</td>
                <td>{claim.Invoice}</td>
                <td>{claim.Mail}</td>
                <td>{claim.statusHR ? 'Accepted' : 'Rejected'}</td>
                <td>{claim.statusAccM ? 'Accepted' : 'Rejected'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;

