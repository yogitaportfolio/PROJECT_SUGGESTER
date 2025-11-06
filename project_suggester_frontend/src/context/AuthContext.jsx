import React, { createContext, useContext, useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'
import api from '../services/api'


const AuthContext = createContext();


export function AuthProvider({ children }){
const [user, setUser] = useState(null);


useEffect(()=>{
const token = localStorage.getItem('token');
if (token){
try{
const payload = jwtDecode(token);
setUser({ id: payload.id, token });
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}catch(e){
console.warn('Invalid token');
localStorage.removeItem('token');
}
}
},[]);


const login = (token) => {
localStorage.setItem('token', token);
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
const payload = jwtDecode(token);
setUser({ id: payload.id, token });
}


const logout = ()=>{
localStorage.removeItem('token');
delete api.defaults.headers.common['Authorization'];
setUser(null);
window.location.href = '/login';
}


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)