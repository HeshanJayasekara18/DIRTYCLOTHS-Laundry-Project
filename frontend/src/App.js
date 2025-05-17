import logo from './logo.svg';
import './App.css';
import React from 'react';
import Navbar from './common/navbar/Navbar';
import Home from './home/Home';
import {BrowserRouter,Route,Routes}from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
