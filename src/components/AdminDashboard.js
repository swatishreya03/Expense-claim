import React from 'react';

const HRDashboard = ({ expenses, approveExpense }) => {
  const handleApprove = (expenseId) => {
    approveExpense(expenseId);
  };
  
  return (
    <div>
      <h1>HR Dashboard</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description}
            {!expense.approved && (
              <button onClick={() => handleApprove(expense.id)}>
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HRDashboard;
