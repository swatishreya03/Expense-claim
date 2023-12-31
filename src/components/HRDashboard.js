import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Topbar from './Topbar';
import Axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const HRDashboard = () => {
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState([]);
  const [baseClaims, setBaseClaims] = useState([]);

  const navigate = useNavigate();

  const getClaims = () => {
    Axios.get(`http://localhost:3001/claim/get-employee-claims-hr/`, {
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
              getClaims();
            }
            else {
              if (data.role === 'employee') {
                navigate('/employee');
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

  useEffect(() => {
    const result = baseClaims.filter((claim) => {
      return claim.employeeID.toLowerCase().match(search.toLowerCase())
    })

    setClaims(result)
  }, [search])



  const acceptClaim = async (id) => {
    await Axios.put(`http://localhost:3001/claim/accept-hr/${id}`, {}, {
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
      toast.error('Something went wrong', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    });
  }


  const rejectClaim = async (id) => {
    await Axios.put(`http://localhost:3001/claim/reject-hr/${id}`, {}, {
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
    }
    ).catch((error) => {
      toast.error('Something went wrong', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      console.log(error);
    });
  }

  const handleDownloadInvoice = async (filename, id) => {
    try {
      const response = await fetch(`http://localhost:3001/claim/download-invoice/${id}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadMail = async (filename, id) => {
    try {
      const response = await fetch(`http://localhost:3001/claim/download-mail/${id}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const columns = [
    {
      name: 'Employee ID',
      selector: (row) => row.employeeID,
      sortable: true
    },
    {
      name: 'Employee Name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true
    },
    {
      name: 'Amount',
      selector: (row) => row.claimAmount,
      sortable: true
    },
    {
      name: 'Claim Date',
      selector: (row) => row.claimDate,
      sortable: true
    },
    {
      name: 'AM Status',
      selector: (row) => row.statusAM ? 'Accepted' : 'Pending',
      sortable: true
    },
    {
      name: 'Invoice',
      selector: (row) => (
        <>
          <button style={
            {
              backgroundColor: 'white',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            className="invoice-button" onClick={() => handleDownloadInvoice(row.invoice, row._id)}> View Invoice</button>
        </>),
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
            className="mail-button" onClick={() => handleDownloadMail(row.mail, row._id)}>View Mail</button>
        </div>),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          {(row.approved === false && row.rejected === false) &&
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
          }
          {
            (row.approved === true && row.rejected === false) &&
            <span>Approved</span>

          }
          {
            (row.approved === false && row.rejected === true) &&
            <span>Rejected</span>
          }
        </>
      )
    }
  ];

  return (
    <div className='dashboard-outer'>
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
      <Topbar name="HR Dashboard" />
      <div className="dashboard-container">
        <DataTable
          title='Claims'
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
    </div>
  );
};

export default HRDashboard;
