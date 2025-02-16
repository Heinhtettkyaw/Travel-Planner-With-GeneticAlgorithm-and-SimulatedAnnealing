// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './components/Dashboard';
import TripForm from './components/TripForm';

import TripReview from './components/TripReview';
import PlacesSelectionWithMap from './components/PlacesSelectionWithMap';
import AdminDashboard from './components/AdminDashboard';
import ManageCities from './components/ManageCities';
import ManagePlaces from './components/ManagePlaces';

import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  if (token) {
    localStorage.setItem('token', token);
  }

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup setToken={setToken} />} />

          <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
          <Route path="/trip" element={<TripForm token={token} />} />
          <Route path="/places" element={<PlacesWrapper token={token} />} />
          <Route path="/review/:tripId" element={<TripReview token={token} />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="cities" element={<ManageCities token={token} />} />
            <Route path="places" element={<ManagePlaces token={token} />} />

          </Route>
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
