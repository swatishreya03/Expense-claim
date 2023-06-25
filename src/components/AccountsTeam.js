import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Topbar from './Topbar';
import Axios from 'axios';

const ACTeams = () => {
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState([
    {
      id: 1,
      employeeId: 10012,
      category: 'Travel',
      amount: 1000,
      expenseDate: '2021-08-01',
      statusByAM: 'Approved',
      statusByHR: 'Approved',
      paidByAccounts: true,
    },
    {
      id: 2,
      employeeId: 10013,
      category: 'Food',
      amount: 500,
      expenseDate: '2021-08-02',
      statusByAM: 'Approved',
      statusByHR: 'Approved',
      paidByAccounts: false,
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
      statusByHR: 'Approved',
      paidByAccounts: true,
    },
    {
      id: 2,
      employeeId: 10013,
      category: 'Food',
      amount: 500,
      expenseDate: '2021-08-02',
      statusByAM: 'Approved',
      statusByHR: 'Approved',
      paidByAccounts: false,
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
          }
          else if (data.role === 'am') {
            navigate('/account-manager');
          }
          else if (data.role === 'hr') {
            navigate('/hr');
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


  const acceptClaim = (id) => {
    const updatedClaims = claims.map((claim) => {
      if (claim.id === id) {
        return {
          ...claim,
          paidByAccounts: true
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
          paidByAccounts: false
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
      name: 'Account Manager Status',
      selector: (row) => row.statusByAM,
      sortable: true
    },
    {
      name: 'HR Status',
      selector: (row) => row.statusByHR,
      sortable: true
    },
    {
      name: 'Paid',
      selector: (row) => row.paidByAccounts ? 'Yes' : 'No',
      sortable: true
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          {
            row.paidByAccounts ?
              <button
                className="reject-button"
                onClick={() => rejectClaim(row.id)}
              >
                Mark Pending
              </button > :
              <button
                className="accept-button"
                onClick={() => acceptClaim(row.id)}
              >
                Mark Paid
              </button >
          }
        </div>
      ),
    }
  ];

  return (
    <>
      <Topbar name="EDUDIGM EXPENSE" />
      <div className="dashboard-container">
        <h2 className="dashboard-title"></h2>
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

export default ACTeams;
