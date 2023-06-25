import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
          }
          else if (data.status === 200) {
            if (data.role === 'employee') {
              navigate('/employee');
            }
            else if (data.role === 'hr') {
              navigate('/hr');
            }
            else if (data.role === 'am') {
              navigate('/account-manager');
            }
            else if (data.role === 'accounts') {
              navigate('/accounts');
            }
          }
        }).catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    await Axios.post('http://localhost:3001/auth/login', {
      email: username,
      password: password,
    }).then(({ data }) => {
      console.log(data);
      if (data.status === 200) {
        localStorage.setItem('token', data.token);
        if (data.role === 'employee') {
          navigate('/employee');
        }
        else if (data.role === 'hr') {
          navigate('/hr');
        }
        else if (data.role === 'am') {
          navigate('/account-manager');
        }
        else if (data.role === 'accounts') {
          navigate('/accounts');
        }
      } else {
        toast.error(data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  };

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
            autoComplete="off"
            placeholder='Enter your email address'
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='off'
            placeholder='Enter your password'
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
