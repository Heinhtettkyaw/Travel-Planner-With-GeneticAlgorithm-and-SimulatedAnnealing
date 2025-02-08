// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import TripForm from './TripForm';
import PlacesSelection from './PlacesSelection';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  if (token) {
    localStorage.setItem('token', token);
  }

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup setToken={setToken} />} />
          <Route path="/trip" element={<TripForm token={token} />} />
          <Route path="/places" element={<PlacesWrapper token={token} />} />
        </Routes>
      </Router>
  );
}

// A wrapper to extract query parameters and pass them to PlacesSelection.
const PlacesWrapper = ({ token }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tripId = query.get('tripId');
  const cityId = query.get('cityId');
  const numberOfDays = parseInt(query.get('numberOfDays'), 10);
  return <PlacesSelection token={token} tripId={tripId} cityId={cityId} numberOfDays={numberOfDays} />;
};

export default App;
