#!/bin/bash

# Create components directory
mkdir -p daily-tracker-pwa/src/components

# Create App.js and App.css
cat > daily-tracker-pwa/src/App.js << APP_JS
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
      case 'Dashboard': return <Dashboard />;
      case 'Track': return <Track />;
      case 'Journal': return <Journal />;
      case 'Flags': return <Flags />;
      default: return <Dashboard />;
    }
  };
  return (
    <div className="App">
      <header className="App-header"><h1>Daily Tracker</h1></header>
      <main>{renderTab()}</main>
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
APP_JS

cat > daily-tracker-pwa/src/App.css << APP_CSS
body { margin: 0; font-family: sans-serif; background-color: #000; color: #fff; }
.App { text-align: center; }
.App-header { background-color: #1a1a1a; padding: 20px; color: #FFD700; }
main { padding: 20px; padding-bottom: 80px; /* For nav overlap */ }
nav { position: fixed; bottom: 0; width: 100%; display: flex; justify-content: space-around; background-color: #1a1a1a; padding: 10px 0; }
nav button { background: linear-gradient(145deg, #FFD700, #B8860B); border: none; color: #000; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 8px; font-weight: bold; }
nav button:hover { background: linear-gradient(145deg, #B8860B, #FFD700); }
APP_CSS

# Create component JS and CSS files
for C in Dashboard Track Journal Flags; do
  # JS file
  cat > daily-tracker-pwa/src/components/${C}.js << COMP_JS
import React from 'react';
import './${C}.css';
const ${C} = () => <div>${C} Content</div>;
export default ${C};
COMP_JS
  # CSS file
  touch daily-tracker-pwa/src/components/${C}.css
done

# Add specific CSS content
cat > daily-tracker-pwa/src/components/Dashboard.css << DASH_CSS
.dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 10px; }
.grid-button { background: linear-gradient(145deg, #FFD700, #B8860B); border: none; color: #000; padding: 20px; font-size: 16px; cursor: pointer; border-radius: 8px; font-weight: bold; width: 100%; min-height: 80px; }
.back-button { background-color: #333; border: 1px solid #FFD700; color: #FFD700; padding: 10px 20px; margin-bottom: 10px; cursor: pointer; border-radius: 5px; }
DASH_CSS

cat > daily-tracker-pwa/src/components/Track.css << TRACK_CSS
.track-container { padding: 10px; }
.filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center; }
.filters input, .filters select { padding: 8px; border-radius: 5px; border: 1px solid #FFD700; background-color: #333; color: #fff; }
.filters button { background: linear-gradient(145deg, #FFD700, #B8860B); border: none; color: #000; padding: 10px 15px; cursor: pointer; border-radius: 5px; font-weight: bold; }
.entry-list { list-style: none; padding: 0; }
.entry-item { background-color: #1a1a1a; border: 1px solid #FFD700; border-radius: 5px; padding: 15px; margin-bottom: 10px; }
.entry-item .timestamp { font-size: 0.9em; color: #aaa; }
.entry-item .category { font-weight: bold; color: #FFD700; }
TRACK_CSS

cat > daily-tracker-pwa/src/components/Journal.css << JOURNAL_CSS
.journal-container { padding: 10px; }
.journal-input textarea { width: 100%; min-height: 100px; padding: 10px; border-radius: 5px; border: 1px solid #FFD700; background-color: #333; color: #fff; box-sizing: border-box; }
.journal-input button, .journal-actions button { background: linear-gradient(145deg, #FFD700, #B8860B); border: none; color: #000; padding: 10px 15px; cursor: pointer; border-radius: 5px; font-weight: bold; margin-top: 10px; }
.journal-entry { background-color: #1a1a1a; border: 1px solid #FFD700; border-radius: 5px; padding: 15px; margin-bottom: 10px; }
.journal-entry .timestamp { font-size: 0.9em; color: #aaa; }
.journal-entry p { white-space: pre-wrap; }
JOURNAL_CSS

cat > daily-tracker-pwa/src/components/Flags.css << FLAGS_CSS
.flags-container { padding: 10px; }
.flags-list { list-style: none; padding: 0; }
.flag-item { background-color: #1a1a1a; border: 1px solid #FFD700; border-radius: 5px; padding: 15px; margin-bottom: 10px; color: #FFD700; font-style: italic; }
FLAGS_CSS
