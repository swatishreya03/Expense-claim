import React from 'react';

const AccountManagerDashboard = ({ expenses, markAsPaid }) => {
  const handleMarkAsPaid = (expenseId) => {
    markAsPaid(expenseId);
  };
  
  return (
    <div>
      <h1>Account Manager Dashboard</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description}
            {expense.approved && !expense.paid && (
              <button onClick={() => handleMarkAsPaid(expense.id)}>
                Mark as Paid
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountManagerDashboard;
