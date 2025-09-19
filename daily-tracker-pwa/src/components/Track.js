import React, { useState, useEffect, useMemo } from 'react';
import * as storage from '../storage';
import './Track.css';

const Track = () => {
  const [entries, setEntries] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setEntries(storage.getEntries());
  }, []);

  const filteredAndSortedEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && entryDate < start) return false;
        if (end && entryDate > end) return false;
        if (categoryFilter && !entry.path.join(' -> ').includes(categoryFilter)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [entries, sortOrder, categoryFilter, startDate, endDate]);

  const exportToCSV = () => {
    const headers = 'Timestamp,Category,Value\n';
    const rows = filteredAndSortedEntries.map(entry => {
      const timestamp = new Date(entry.timestamp).toLocaleString();
      const category = entry.path.join(' -> ');
      const value = entry.value;
      return `"${timestamp}","${category}","${value}"\n`;
    }).join('');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tracker_entries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="track-container">
      <h2>Tracked Entries</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by category..."
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
      <ul className="entry-list">
        {filteredAndSortedEntries.map((entry, index) => (
          <li key={index} className="entry-item">
            <span className="timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
            <span className="category">{entry.path.join(' -> ')}</span>
            <span className="value">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Track;
