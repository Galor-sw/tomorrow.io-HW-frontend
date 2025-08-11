import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Alerts from './components/Alerts';
import CurrentState from './components/CurrentState';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'alerts':
        return <Alerts />;
      case 'current-state':
        return <CurrentState />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="lg:ml-16">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
