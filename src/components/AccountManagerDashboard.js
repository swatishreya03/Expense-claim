import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material'

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

  //const navigate = useNavigate();

  // useEffect(() => {
  //   const result = baseClaim.filter((claim) => {
  //     return claim.id.match(search)
  //   })
  //   setClaims(result)
  // }, [search])

  const navigate = useNavigate();

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
      name: 'Actions',
      cell: (row) => (
        <div>
          <button
            className="action-button"
            onClick={() => acceptClaim(row.id)}
          >
            Accept
          </button >

          <button
            className="action-button"
            onClick={() => rejectClaim(row.id)}
          >
            Reject
          </button >
        </div>
      ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">ACCOUNT MANAGER</h2>
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
  );
};

export default AMDashboard;
