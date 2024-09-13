import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import ItineraryPage from './ItineraryPage';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
    </Routes>
  );
}

export default App;
