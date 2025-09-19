import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Track from './components/Track';
import Journal from './components/Journal';
import Flags from './components/Flags';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Track':
        return <Track />;
      case 'Journal':
        return <Journal />;
      case 'Flags':
        return <Flags />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Daily Tracker</h1>
      </header>
      <main>
        {renderTab()}
      </main>
      <nav>
        <button onClick={() => setActiveTab('Dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('Track')}>Track</button>
        <button onClick={() => setActiveTab('Journal')}>Journal</button>
        <button onClick={() => setActiveTab('Flags')}>Flags</button>
      </nav>
    </div>
  );
}

export default App;
