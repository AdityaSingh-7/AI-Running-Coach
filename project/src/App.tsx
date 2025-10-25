import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RunningPage from './pages/RunningPage';
import HistoryPage from './pages/HistoryPage';
import ClubsPage from './pages/ClubsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/running" element={<RunningPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;