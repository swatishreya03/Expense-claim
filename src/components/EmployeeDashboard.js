import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      Axios.get('http://localhost:3001/auth/', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          if (data.status === 410) {
            localStorage.removeItem('token');
            navigate('/');
          }
          else if (data.status === 200) {
            if (data.role === 'hr') {
              navigate('/hr');
            }
            else if (data.role === 'am') {
              navigate('/account-manager');
            }
          }
        }).catch((error) => {
          console.log(error);
        });
    }
    else {
      navigate('/');
    }
  }, []);


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

