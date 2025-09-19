import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Dashboard.css';

const Dashboard = () => {
  const [schema, setSchema] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');

  const reloadSchema = () => {
    setSchema(storage.getSchema());
  }

  useEffect(() => {
    reloadSchema();
  }, []);

  const getCurrentView = () => {
    if (!schema) return null;
    let view = schema;
    for (const key of currentPath) {
      view = view[key]?.next || view[key];
    }
    return view;
  };

  const handleSelect = (key) => {
    const currentView = getCurrentView();
    if (currentView?.options?.includes(key)) {
        storage.addEntry({ path: currentPath, value: key });
        setCurrentPath([]);
        alert(`Entry saved: ${currentPath.join(' -> ')} -> ${key}`);
        return;
    }

    const newPath = [...currentPath, key];
    setCurrentPath(newPath);
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleSaveNewOption = () => {
    if (newOptionName.trim() === '') return;
    storage.addOptionToSchema(currentPath, newOptionName);
    reloadSchema(); // Reload schema from storage to get the new option
    setNewOptionName('');
    setIsAdding(false);
  };

  const currentView = getCurrentView();
  const canAddOptions = currentView && currentView.options;

  return (
    <div>
      {currentPath.length > 0 && <button onClick={handleBack} className="back-button">Back</button>}

      <div className="dashboard-grid">
        {currentView && (currentView.options ? currentView.options : Object.keys(currentView)).map(key => (
          <button key={key} onClick={() => handleSelect(key)} className="grid-button">
            {key}
          </button>
        ))}
      </div>

      {canAddOptions && (
        <div className="customization-area">
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)} className="add-new-button">Add New Option</button>
          ) : (
            <div className="add-new-form">
              <input
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="New option name"
              />
              <button onClick={handleSaveNewOption}>Save</button>
              <button onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
