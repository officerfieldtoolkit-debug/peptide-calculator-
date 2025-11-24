import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Calculator from './pages/Calculator';
import HalfLife from './pages/HalfLife';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="half-life" element={<HalfLife />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
