// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './components/Dashboard';
import TripForm from './components/TripForm';
import PlacesSelection from './components/PlacesSelection';
import TripReview from './components/TripReview';
import PlacesSelectionWithMap from './components/PlacesSelectionWithMap';
import TripFormWithMap from './components/TripFormWithMap';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  if (token) {
    localStorage.setItem('token', token);
  }

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup setToken={setToken} />} />
          <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
          <Route path="/trip" element={<TripForm token={token} />} />
          <Route path="/places" element={<PlacesWrapper token={token} />} />
          <Route path="/review/:tripId" element={<TripReview token={token} />} />
        </Routes>
      </Router>
  );
}

const PlacesWrapper = ({ token }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tripId = query.get('tripId');
  const cityId = query.get('cityId');
  const numberOfDays = parseInt(query.get('numberOfDays'), 10);
  return <PlacesSelectionWithMap token={token} tripId={tripId} cityId={cityId} numberOfDays={numberOfDays} />;
};

export default App;
