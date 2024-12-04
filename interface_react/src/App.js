// import logo from './logo.svg';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Nav from './component/Nav';
import { UserContextProvider } from './component/UserContext';
// import Validation from './pages/Validation';
// import Add from './pages/Add';
import UpdateEvaluation from './pages/UpdateEvaluation';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Rapport from './pages/Rapport';
import Profil from './pages/Profil';
import AdminAlignment from './pages/AdminAlignment'
import RequestResetPassword from './pages/RequestResetPassword'
import ResetPassword from './pages/ResetPassword';
// import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
// import { useState, useRef } from 'react';

function App() {
    const role = localStorage.getItem('role')

    return (
        <UserContextProvider>
            <Router basename="/modern-textpair">
                <Nav />
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/profil' element={<Profil />}></Route>
                    <Route path='/update' element={<UpdateEvaluation />}></Route>
                    <Route path='/admin/dashboard' element={<Dashboard />}></Route>
                    <Route path='/admin/alignement' element={<AdminAlignment />}></Route>

                    <Route path='/admin/register' element={<Register />}></Route>
                    {/* <Route path='/validation' element={<Validation />}></Route> */}
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/forgot-password' element={<RequestResetPassword />}></Route>
                    <Route path='/reset-password' element={<ResetPassword />}></Route>
                    <Route path='/admin/rapport' element={<Rapport />}></Route>
                    <Route path="*" element={<NotFound />} />
                    {/* <Route path='/' element={<Add />}></Route> */}
                </Routes>
            </Router>
        </UserContextProvider>
    )
}
export default App;
