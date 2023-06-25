import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import Axios from 'axios';

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  const getClaims = (employeeId) => {
    console.log(employeeId);
    Axios.get(`http://localhost:3001/claim/get-employee-claims/${employeeId}`, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        setClaims(data.claims);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

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
            if (data.role === 'employee') {
              getClaims(data.id);
            }
            else {
              if (data.role === 'hr') {
                navigate('/hr');
              }
              else if (data.role === 'am') {
                navigate('/account-manager');
              }
              else if (data.role === 'accounts') {
                navigate('/accounts');
              }
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


  const columns = [
    {
      name: 'Category',
      selector: (row) => row.category === 'other' ? row.otherCategory : row.category,
      sortable: true,

    },
    {
      name: 'Amount',
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: 'Invoice',
      selector: (row) => (
        <div>
          <button style={
            {
              backgroundColor: 'white',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            className="invoice-button">View Invoice</button>
        </div>),
    },
    {
      name: 'Mail',
      selector: (row) => (
        <div>
          <button style={
            {
              backgroundColor: 'white',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            className="mail-button">View Mail</button>
        </div>),
    },
    {
      name: 'Status',
      selector: (row) => row.rejected ? 'Rejected' : row.approved ? 'Approved' : 'Pending',
      sortable: true,
    },
  ];

  return (
    <>
      <Topbar name="Employee Dashboard" />

      <div className="employee-dashboard">
        <Link to="/employee/add-claim" className="add-claim-button">
          Add New Claim
        </Link>

        <h2>Previous Claims</h2>
        <DataTable
          columns={columns}
          data={claims}
          pagination
          responsive
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight='500px'
        />
      </div>
    </>
  );
};

export default EmployeeDashboard;
