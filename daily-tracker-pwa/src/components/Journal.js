import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Journal.css';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    const sortedEntries = storage.getJournalEntries().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setEntries(sortedEntries);
  }, []);

  const handleSave = () => {
    if (newEntry.trim() === '') return;
    storage.addJournalEntry(newEntry);
    setNewEntry('');
    const sortedEntries = storage.getJournalEntries().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setEntries(sortedEntries);
  };

  const exportToCSV = () => {
    const headers = 'Timestamp,Entry\n';
    const rows = entries.map(entry => {
      const timestamp = new Date(entry.timestamp).toLocaleString();
      const text = `"${entry.text.replace(/"/g, '""')}"`;
      return `"${timestamp}",${text}\n`;
    }).join('');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'journal_entries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="journal-container">
      <h2>Journal</h2>
      <div className="journal-input">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write your thoughts..."
        />
        <button onClick={handleSave}>Save Entry</button>
      </div>
      <div className="journal-actions">
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
      <div className="journal-entries">
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry">
            <div className="timestamp">{new Date(entry.timestamp).toLocaleString()}</div>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
