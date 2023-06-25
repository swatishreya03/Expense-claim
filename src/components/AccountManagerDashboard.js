import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Topbar from './Topbar';
import Axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AMDashboard = () => {
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState([]);
  const [baseClaims, setBaseClaims] = useState([]);
  const navigate = useNavigate();

  const getClaims = () => {
    Axios.get(`http://localhost:3001/claim/get-employee-claims-am/`, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        setClaims(data.claims);
        setBaseClaims(data.claims);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    const result = baseClaims.filter((claim) => {
      return claim.employeeID.toLowerCase().match(search.toLowerCase())
    })

    setClaims(result)
  }, [search])

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
          if (data.role === 'am') {
            getClaims();
          } else {
            if (data.role === 'employee') {
              navigate('/employee');
            } else if (data.role === 'hr') {
              navigate('/hr');
            }
            else if (data.role === 'accounts') {
              navigate('/accounts');
            }
          }

        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      navigate('/');
    }
  }, []);

  const acceptClaim = async (id) => {
    await Axios.put(`http://localhost:3001/claim/accept-am/${id}`, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        toast.success('Claim Accepted Successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getClaims();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const rejectClaim = async (id) => {
    await Axios.put(`http://localhost:3001/claim/reject-am/${id}`, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        toast.success('Claim Rejected Successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getClaims();
      }
    }).catch((error) => {
      console.log(error);
    });
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
            onClick={() => acceptClaim(row._id)}
          >
            Accept
          </button >

          <button
            className="reject-button"
            onClick={() => rejectClaim(row._id)}
          >
            Reject
          </button >
        </div>
      ),
    }
  ];

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
              label='Search with Employee ID'
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
