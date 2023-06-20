import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import '../Css/HRDashboard.css';

const HRDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the submitted claims from the server/API
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await fetch('/api/claims'); // Replace with your server/API endpoint
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleSortBy = (value) => {
    setSortBy(value);
  };

  const handleTotalExpenses = (value) => {
    setTotalExpenses(value);
  };

  const columns = [
    { name: 'S.no.', selector: 'id', sortable: true },
    { name: 'Category', selector: 'category', sortable: true },
    { name: 'Amount', selector: 'amount', sortable: true },
    { name: 'Expense Date', selector: 'expenseDate', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Add Comment', selector: 'comment', sortable: true },
    { name: 'Paid By', selector: 'paidBy', sortable: true },
    { name: 'AM Status', selector: 'amStatus', sortable: true },
    { name: 'AM Comment', selector: 'amComment', sortable: true },
  ];

  const filteredClaims = claims.filter((claim) => {
    if (sortBy === '') return true;
    return claim.status === sortBy;
  });

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Claims Dashboard</h2>

      <div className="sort-container">
        <button className="sort-button" onClick={() => handleSortBy('')}>
          Sort By
        </button>
        {sortBy && (
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSortBy(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        )}
      </div>

      <div className="total-expenses-container">
        <button
          className="total-expenses-button"
          onClick={() => handleTotalExpenses('')}
        >
          Total Expenses
        </button>
        {totalExpenses && (
          <select
            className="total-expenses-select"
            value={totalExpenses}
            onChange={(e) => handleTotalExpenses(e.target.value)}
          >
            <option value="">All</option>
            <option value="monthly">Monthly</option>
            <option value="date">Date</option>
            <option value="month">Month</option>
          </select>
        )}
      </div>

      <DataTable
        className="data-table"
        columns={columns}
        data={filteredClaims}
        noHeader
        striped
        responsive
        pagination
      />
    </div>
  );
};

export default HRDashboard;
