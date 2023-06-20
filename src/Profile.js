
import React, { useState } from 'react';
//import { Switch } from 'react-router-dom';
import Login from './Login';
import HRDashboard from './components/HRDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AccountManagerDashboard from './components/AccountManagerDashboard';
//import AdminDashboard from './components/AdminDashboard';

const Profile = () => {
  const [userType, setUserType] = useState('');
  const [expenses, setExpenses] = useState([]);

  //const role = "employee"; // Replace with the role of the user  


  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      description: expense,
      approved: false,
      paid: false,
    };
    setExpenses([...expenses, newExpense]);
  };

  const approveExpense = (expenseId) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === expenseId) {
        return { ...expense, approved: true };
      }
      return expense;
    });
    setExpenses(updatedExpenses);
  };

  const markAsPaid = (expenseId) => {
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === expenseId) {
        return { ...expense, paid: true };
      }
      return expense;
    });
    setExpenses(updatedExpenses);
  };

  const renderDashboard = () => {
    switch (userType) {
      case 'employee':
        return <EmployeeDashboard addExpense={addExpense} />;
      case 'hr':
        return (
          <HRDashboard
            expenses={expenses.filter((expense) => !expense.approved)}
            approveExpense={approveExpense}
          />
        );
      case 'accountmanager':
        return (
          <AccountManagerDashboard
            expenses={expenses.filter((expense) => expense.approved && !expense.paid)}
            markAsPaid={markAsPaid}
          />
        );
      case 'admin':
        return <div>Admin Dashboard</div>;
      default:
        return <Login setUserType={setUserType} />;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Profile;

