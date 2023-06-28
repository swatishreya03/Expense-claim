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
      name: 'Category',
      selector: (row) => row.category === 'other' ? row.otherCategory : row.category,
      sortable: true,

    },
    {
      name: 'Amount',
      selector: (row) => row.claimAmount,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => row.claimDate,
      sortable: true,
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
      name: 'Admin Status',
      selector: (row) => row.statusAdmin ? 'Accepted' : 'Pending',
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => row.rejected ? 'Rejected' : row.paid ? 'Paid' : 'Pending',
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
