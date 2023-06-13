import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Perform login validation using an API request
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { role } = await response.json();

        // Redirect to respective dashboard based on user role
        if (role === 'hr') {
          // Handle HR dashboard redirection
        } else if (role === 'employee') {
          // Handle Employee dashboard redirection
        } else if (role === 'account_manager') {
          // Handle Account Manager dashboard redirection
        } else if (role === 'admin') {
          // Handle Admin dashboard redirection
        }
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
