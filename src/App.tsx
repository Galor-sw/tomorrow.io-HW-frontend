import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Alerts from './components/Alerts';
import CurrentState from './components/CurrentState';
import './App.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const location = useLocation();

  // Sync activeTab with current route
  useEffect(() => {
    const pathToTab: { [key: string]: string } = {
      '/home': 'home',
      '/alerts': 'alerts',
      '/current-state': 'current-state'
    };
    
    const currentTab = pathToTab[location.pathname];
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="App">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="lg:ml-16">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/current-state" element={<CurrentState />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
