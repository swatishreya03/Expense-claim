import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Topbar from './Topbar';
import Axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ACTeams = () => {
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState([]);
  const [baseClaim, setBaseClaim] = useState([]);

  const navigate = useNavigate();

  const getClaims = async () => {
    await Axios.get(`http://localhost:3001/claim//get-employee-claims-accounts/`, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        setClaims(data.claims);
        setBaseClaim(data.claims);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    const result = baseClaim.filter((claim) => {
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
          if (data.role === 'accounts') {
            getClaims();
          }
          else {
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
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    else {
      navigate('/');
    }
  }, []);


  const acceptClaim = async (id) => {
    await Axios.put(`http://localhost:3001/claim/mark-paid/${id}`, {}, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
      if (data.status === 200) {
        toast.success('Claim Marked as Paid!', {
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
    await Axios.put(`http://localhost:3001/claim/reject-accounts/${id}`, {}, {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    }).then(({ data }) => {
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
    }).catch((error) => {
      console.log(error);
    });
  }

  const columns = [
    {
      name: 'Employee ID',
      selector: (row) => row.employeeID,
      sortable: true
    },
    {
      name: 'Employee name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Category',
      selector: (row) => row.category==='other' ? row.otherCategory : row.category,
      sortable: true
    },
    {
      name: 'Amount',
      selector: (row) => row.claimAmount,
      sortable: true
    },
    {
      name: 'Expense Date',
      selector: (row) => row.claimDate,
      sortable: true
    },
    
    {
      name: 'Status',
      selector: (row) => row.statusHR? 'Accepted' : 'Rejected',
      sortable: true
    },
   /* {
      name: 'Paid',
      selector: (row) => row.paidByAccounts ? 'Yes' : 'No',
      sortable: true
    },*/
    {
      name: 'Actions',
      cell: (row) => (
        <>
        {(row.paid === false && row.rejected === false ) &&
        <div>

          <button
            className="reject-button"
            onClick={() => rejectClaim(row._id)}
          >
            Reject Claim
          </button >
          <button
            className="accept-button"
            onClick={() => acceptClaim(row._id)}
          >
            Mark Paid
          </button >

        </div>
      }
      {
      (row.paid === true && row.rejected === false ) &&
      <span>Paid</span>
  
      }
      {
        (row.paid === false && row.rejected === true ) &&
        <span>Rejected</span>
      }
          </>
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

export default ACTeams;
