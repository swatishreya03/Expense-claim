import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Topbar from './Topbar';
import Axios from 'axios';

const AMDashboard = () => {
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState([
    {
      id: 1,
      employeeId: 10012,
      category: 'Travel',
      amount: 1000,
      expenseDate: '2021-08-01',
      statusByAM: 'Approved',
      statusByHR: 'Approved'
    },
    {
      id: 2,
      employeeId: 10013,
      category: 'Food',
      amount: 500,
      expenseDate: '2021-08-02',
      statusByAM: 'Approved',
      statusByHR: 'Approved'
    },
  ]);
  const [baseClaim, setBaseClaim] = useState([
    {
      id: 1,
      category: 'Travel',
      employeeId: 10012,
      amount: 1000,
      expenseDate: '2021-08-01',
      statusByAM: 'Approved',
      statusByHR: 'Approved'
    },
    {
      id: 2,
      employeeId: 10013,
      category: 'Food',
      amount: 500,
      expenseDate: '2021-08-02',
      statusByAM: 'Approved',
      statusByHR: 'Approved'
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      Axios.get('http://localhost:3001/auth/', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      }).then(({ data }) => {
        if (data.status === 410) {
          localStorage.removeItem('token');
          navigate('/');
        }
        else if (data.status === 200) {
          if (data.role === 'employee') {
            navigate('/employee');
          } else if (data.role === 'hr') {
            navigate('/hr');
          }
          else if (data.role === 'accounts') {
            navigate('/accounts');
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      navigate('/');
    }
  }, []);

  const acceptClaim = (id) => {
    const updatedClaims = claims.map((claim) => {
      if (claim.id === id) {
        return {
          ...claim,
          statusByAM: 'Approved'
        };
      }
      return claim;
    });
    setClaims(updatedClaims);
  }

  const rejectClaim = (id) => {
    const updatedClaims = claims.map((claim) => {
      if (claim.id === id) {
        return {
          ...claim,
          statusByAM: 'Rejected'
        };
      }
      return claim;
    });
    setClaims(updatedClaims);
  }

  const columns = [
    {
      name: 'Employee ID',
      selector: (row) => row.employeeId,
      sortable: true
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true
    },
    {
      name: 'Amount',
      selector: (row) => row.amount,
      sortable: true
    },
    {
      name: 'Expense Date',
      selector: (row) => row.expenseDate,
      sortable: true
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='action-buttons'>
          <button
            className="accept-button"
            onClick={() => acceptClaim(row.id)}
          >
            Accept
          </button >

          <button
            className="reject-button"
            onClick={() => rejectClaim(row.id)}
          >
            Reject
          </button >
        </div>
      ),
    }
  ];

  return (
    <>
      <Topbar name="Account Manager Dashboard" />
      <div className="dashboard-container">
        <DataTable
          columns={columns}
          data={claims}
          striped
          responsive
          pagination
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight='500px'
          subHeader
          subHeaderComponent={
            <TextField
              id='search'
              label='Search'
              type='search'
              variant='outlined'
              className='input'
              size='small'
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        />
      </div>
    </>
  );

};

export default AMDashboard;
