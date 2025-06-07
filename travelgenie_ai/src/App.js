import React from 'react';
import './App.css';
// PUBLIC_INTERFACE
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import MapPage from './pages/MapPage';
import WeatherPage from './pages/WeatherPage';
import ChatPage from './pages/ChatPage';

function App() {
  // Main App component with strict routing for all TravelGenie pages
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> TravelGenie AI
              </div>
              <div>
                {/* No button here, navigation lives on HomePage and/or per-page */}
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="container" style={{ paddingTop: 110, minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;