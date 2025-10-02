import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddMedicine from './pages/AddMedicine';
import SearchMedicine from './pages/SearchMedicine';
import ExpiredMedicines from './pages/ExpiredMedicines';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddMedicine />} />
          <Route path="/search" element={<SearchMedicine />} />
          <Route path="/expired" element={<ExpiredMedicines />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
