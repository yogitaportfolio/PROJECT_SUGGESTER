import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App(){
  return (
    <div >
      <Navbar />
      <Outlet />
    </div>
  );
}
