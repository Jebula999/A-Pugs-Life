import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Flags.css';

const Flags = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const entries = storage.getEntries();
    const generatedFlags = analyzeCorrelations(entries);
    setFlags(generatedFlags);
    setLoading(false);
  }, []);

  const analyzeCorrelations = (entries) => {
    const newFlags = [];

    // Correlation 1: Mood vs. Sleep Duration
    const sleepEntries = entries.filter(e => e.path.join('') === 'SleepLastNightDuration');
    const moodEntries = entries.filter(e => e.path.join('') === 'Mood');

    let lowMoodAfterShortSleepCount = 0;

    sleepEntries.forEach(sleepEntry => {
      const sleepDate = new Date(sleepEntry.timestamp).toDateString();
      const sleepDuration = parseInt(sleepEntry.value.replace('h', ''));

      if (sleepDuration <= 5) {
        const sameDayMood = moodEntries.find(moodEntry => {
          const moodDate = new Date(moodEntry.timestamp).toDateString();
          return moodDate === sleepDate && (moodEntry.value === 'Low' || moodEntry.value === 'Irritable');
        });

        if (sameDayMood) {
          lowMoodAfterShortSleepCount++;
        }
      }
    });

    if (lowMoodAfterShortSleepCount > 2) {
      newFlags.push("You seem to have a lower mood on days after you've had 5 hours of sleep or less.");
    }

    // Add more correlation checks here in the future

    return newFlags;
  };

  return (
    <div className="flags-container">
      <h2>Insights & Flags</h2>
      {loading ? (
        <p>Analyzing data...</p>
      ) : flags.length > 0 ? (
        <ul className="flags-list">
          {flags.map((flag, index) => (
            <li key={index} className="flag-item">{flag}</li>
          ))}
        </ul>
      ) : (
        <p>Not enough data to find patterns yet. Keep tracking!</p>
      )}
    </div>
  );
};

export default Flags;
