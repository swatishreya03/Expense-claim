import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import Axios from 'axios';

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([
    {
      Category: 'Category 1',
      Amount: 100,
      Invoice: 'Invoice 1',
      Mail: 'Mail 1',
      statusHR: true,
      statusAccM: true,
      statusRm: 'Paid',
    },
    {
      Category: 'Category 2',
      Amount: 200,
      Invoice: 'Invoice 2',
      Mail: 'Mail 2',
      statusHR: false,
      statusAccM: true,
      statusRm: 'Pending',
    },
    // Add more claim objects as needed
  ]);

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


  const columns = [
    {
      name: 'Category',
      selector: 'Category',
      sortable: true,

    },
    {
      name: 'Amount',
      selector: 'Amount',
      sortable: true,
    },
    {
      name: 'Invoice',
      selector: 'Invoice',
      sortable: true,
    },
    {
      name: 'Mail',
      selector: 'Mail',
      sortable: true,
    },
    {
      name: 'HR Status',
      selector: 'statusHR',
      sortable: true,
      cell: (row) => (row.statusHR ? 'Accepted' : 'Rejected'),
    },
    {
      name: 'AM Status',
      selector: 'statusAccM',
      sortable: true,
      cell: (row) => (row.statusAccM ? 'Accepted' : 'Rejected'),
    },
    {
      name: 'RM Status',
      selector: 'statusRm',
      sortable: true,
    },
  ];

  return (
    <>
      <Topbar name="Employee Dashboard" />

      <div className="employee-dashboard">
        <h1>Dashboard</h1>

        <Link to="/employee/add-claim" className="add-claim-button">
          Add New Claim
        </Link>

        <h2>Previous Claims</h2>
        <DataTable

          columns={columns}

          data={claims}
          pagination
        />
      </div>
    </>
  );
};

export default EmployeeDashboard;
