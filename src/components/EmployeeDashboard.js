import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = ({ expenses, addExpense }) => {
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [bill, setBill] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      expenseType,
      amount,
      bill,
      hrStatus: 'Pending',
      accountManagerStatus: 'Pending',
    };
    addExpense(newExpense);
    setExpenseType('');
    setAmount('');
    setBill('');
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <div>
        <h3>Add New Expense</h3>
        <form onSubmit={handleAddExpense}>
          <label>
            Expense Type:
            <input
              type="text"
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
            />
          </label>
          <br />
          <label>
            Amount:
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <br />
          <label>
            Bill:
            <input
              type="file"
              onChange={(e) => setBill(e.target.files[0])}
            />
          </label>
          <br />
          <button type="submit">Add Expense</button>
        </form>
      </div>
      <div>
        <h3>Expense Status</h3>
        <table>
          <thead>
            <tr>
              <th>Expense Type</th>
              <th>Amount Claimed</th>
              <th>Status by HR</th>
              <th>Status by Account Manager</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate over the expenses and display each row */}
            {/* Assuming expenses is an array of expense objects */}
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.expenseType}</td>
                <td>{expense.amount}</td>
                <td>{expense.hrStatus}</td>
                <td>{expense.accountManagerStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
