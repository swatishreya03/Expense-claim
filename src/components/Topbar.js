import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../img/logo/Logo.jpeg';
import { useNavigate } from 'react-router-dom';

function Topbar(props) {

  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar__left">
        <img src={Logo} alt="Company Logo" className="topbar__logo" />
      </div>
      <div className="topbar__center">
        <h1 className="topbar__company-name">{props.name}</h1>
      </div>
      <div className="topbar__right">
        <button className="topbar__logout-btn" onClick={() => {
          localStorage.removeItem('token')
          navigate('/')
        }}>
          <LogoutIcon className="topbar__logout-icon" />
        </button>
      </div>
    </div>
  );
}

export default Topbar;
