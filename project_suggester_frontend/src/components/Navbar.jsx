import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

//   return (
//     // <header className="header">
//     //   {/* <div className="logo">Project Suggester</div> */}
//     //   <nav className="nav">
//     //     {/* <Link to="/dashboard" className="small">Dashboard</Link>
//     //     <Link to="/profile" className="small">Profile</Link> */}
//     //     {user ? (
//     //       <>
//     //         <span className="small" style={{marginLeft:12}}>Hi, {user.name}</span>
//     //         <button onClick={logout} style={{marginLeft:8}} className="small">Logout</button>
//     //       </>
//     //     ) : (
//     //       <>
//     //         <Link to="/login" className="small">Login</Link>
//     //         <Link to="/register" className="small">Register</Link>
//     //       </>
//     //     )}
//     //   </nav>
//     // </header>
//   );
}
