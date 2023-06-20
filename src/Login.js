import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    await Axios.post('http://localhost:3001/login', {
      username: username,
      password: password,
    }).then(({ data }) => {
      if (data.status === 200) {
        if (data.role === 'employee') {
          navigate('/employee');
        }
        else if (data.role === 'hr') {
          navigate('/hr');
        }
        else if (data.role === 'accountmanager') {
          navigate('/account-manager');
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className='login'>
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
