import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Dashboard.css';

const Dashboard = () => {
    const [schema, setSchema] = useState(null);
    const [history, setHistory] = useState([]); // Path of keys
    const [valueChain, setValueChain] = useState([]); // Accumulated values

    useEffect(() => {
        setSchema(storage.getSchema());
    }, []);

    const getNodeFromPath = (path) => {
        if (!schema) return null;
        let node = schema;
        for (const key of path) {
            node = node[key];
        }
        return node;
    };

    // --- Auto-forwarding for single-key nodes ---
    useEffect(() => {
        const currentNode = getNodeFromPath(history);
        if (currentNode) {
            const keys = Object.keys(currentNode);
            if (keys.length === 1 && !currentNode.options) {
                const nextNode = currentNode[keys[0]];
                if (nextNode && (nextNode.options || Object.keys(nextNode).length > 0)) {
                    // This is an intermediate node like "Duration" or "Dreams", skip it
                    setHistory([...history, keys[0]]);
                }
            }
        }
    }, [history, schema]);


    const handleSelect = (key) => {
        const currentNode = getNodeFromPath(history);

        // --- Special Case: Sleep Flow ---
        const isSleepFlow = history[0] === 'Sleep';
        if (isSleepFlow) {
            const currentLevel = history.length;
            // Level 2: User selected Nap or LastNight, now looking at Duration options
            if (currentLevel === 2 && currentNode.options.includes(key)) {
                setValueChain([key]); // Start the value chain with duration
                setHistory([...history, 'next', 'Dreams', 'Type']);
                return;
            }
            // Level 5: User is looking at Dream Type options
            if (currentLevel === 5 && Object.keys(currentNode).includes(key)) {
                if (key === 'None') {
                    storage.addEntry({ path: ['Sleep', history[1]], value: [...valueChain, 'No Dreams'].join(', ') });
                    alert('Entry Saved');
                    setHistory([]); setValueChain([]);
                } else {
                    setValueChain([...valueChain, key]);
                    setHistory([...history, key]);
                }
                return;
            }
            // Level 6: User is looking at Dream Subtype options
            if (currentLevel === 6 && currentNode.includes(key)) {
                 storage.addEntry({ path: ['Sleep', history[1]], value: [...valueChain, key].join(', ') });
                 alert('Entry Saved');
                 setHistory([]); setValueChain([]);
                 return;
            }
        }
        // --- End of Special Case ---

        const nextNode = currentNode[key];
        if (nextNode) { // It's a category, drill down
            setHistory([...history, key]);
        } else { // It's a leaf node selection
            storage.addEntry({ path: history, value: key });
            alert('Entry Saved');
            setHistory([]);
        }
    };

    const handleBack = () => {
        if (history.length > 0) {
            // A more intelligent back is needed for the sleep flow to remove values from valueChain
            setHistory(history.slice(0, -1));
            // For simplicity, reset valueChain on any back press
            setValueChain([]);
        }
    };

    const currentNode = getNodeFromPath(history);
    if (!currentNode) return <div>Loading...</div>;

    const options = currentNode.options ? currentNode.options : Object.keys(currentNode);

    return (
        <div>
            {history.length > 0 && <button onClick={handleBack} className="back-button">Back</button>}
            <div className="dashboard-grid">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)} className="grid-button">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
