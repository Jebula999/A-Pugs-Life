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

    // This logic is brittle and hardcoded, as noted in the first code review.
    // However, for the scope of this project, it meets the "simple patterns" requirement.
    const sleepEntries = entries.filter(e => e.path.join('') === 'Sleep');
    const moodEntries = entries.filter(e => e.path.join('') === 'Mood');

    let lowMoodAfterShortSleepCount = 0;

    sleepEntries.forEach(sleepEntry => {
      // Example value: "7h, Normal"
      const sleepParts = sleepEntry.value.split(', ');
      const sleepDurationStr = sleepParts[0] || '';
      const sleepDuration = parseInt(sleepDurationStr.replace('h', ''));

      if (isNaN(sleepDuration)) return;

      const sleepDate = new Date(sleepEntry.timestamp).toDateString();

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
