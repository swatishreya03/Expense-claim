import React, { useState } from 'react';
import '../Css/EmployeeDashboard.css'; // Import the CSS file for styling
import AddClaimForm from './AddClaimForm';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [data, setData] = useState([]);


  // Function to handle claim form submission
  const handleClaimSubmission = (category, amount, invoice, Mail) => {
    const newClaim = {
      category,
      amount,
      invoice,
      Mail,
      statusHR: 'Pending',
      statusAccM: 'Pending'
    };

    setClaims(prevClaims => [...prevClaims, newClaim]);
  };
  useEffect(() => {
    let from_data = [];
    from_data.push(JSON.parse(localStorage.getItem('from_data')));
    console.log(from_data);
    setData(from_data);
  },[])

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>

      <Link to="/AddClaimForm" className="add-claim-button">
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
          {/* {claims.map((claim, index) => (
            <tr key={index}>
              <td>{claim.category}</td>
              <td>{claim.amount}</td>
              <td>{claim.invoice}</td>
              <td>{claim.Mail}</td>
              <td>{claim.statusHR}</td>
              <td>{claim.statusAccM}</td>
            </tr>
          ))} */}
          {data.map((claim, index) => {

            return (
              <tr key={index}>
                <td>{claim.Category}</td>
                <td>{claim.Amount}</td>
                <td>{claim.Invoice}</td>
                <td>{claim.Mail}</td>
                <td>{claim.statusHR}</td>
              <td>{claim.statusAccM}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;

