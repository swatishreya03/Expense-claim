import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';

const App = () => { 
  return (
    <Login />
      

    /*<Router>
      <Routes>
      
        <Route path="/login" element={Login} />
        <Route path="/profile" element={Profile} />
      
      </Routes>
       
    </Router>*/

  );
};

export default App;
