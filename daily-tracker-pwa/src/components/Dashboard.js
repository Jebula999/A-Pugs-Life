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
            if (!node || !node[key]) return null;
            node = node[key];
        }
        return node;
    };

    const handleSelect = (key) => {
        const path = history.join(' -> ');

        // --- SPECIAL CASE: SLEEP ---
        if (path.startsWith('Sleep')) {
            // State: history = ['Sleep', 'LastNight'/'Nap'] -> Now showing Duration options
            if (history.length === 2) {
                setValueChain([key]); // key is the duration, e.g. "7h"
                setHistory([...history, 'Duration', 'next', 'Dreams', 'Type']);
                return;
            }
            // State: history = [..., 'Dreams', 'Type'] -> Now showing Dream Type options
            if (history[history.length - 1] === 'Type') {
                if (key === 'None') {
                    storage.addEntry({ path: ['Sleep', history[1]], value: [...valueChain, 'No Dreams'].join(', ') });
                    alert('Saved');
                    setHistory([]); setValueChain([]);
                } else {
                    setValueChain([...valueChain, key]); // key is 'Normal' or 'Real'
                    setHistory([...history, key]);
                }
                return;
            }
            // State: history = [..., 'Type', 'Normal'/'Real'] -> Now showing final dream options
            if (history.length > 2 && history[history.length - 2] === 'Type') {
                storage.addEntry({ path: ['Sleep', history[1]], value: [...valueChain, key].join(', ') });
                alert('Saved');
                setHistory([]); setValueChain([]);
                return;
            }
        }
        // --- END SPECIAL CASE ---

        // --- GENERIC LOGIC ---
        const currentNode = getNodeFromPath(history);
        const nextNode = currentNode ? currentNode[key] : null;

        if (nextNode && typeof nextNode === 'object') { // Drill down
            setHistory([...history, key]);
        } else { // Save
            storage.addEntry({ path: history, value: key });
            alert('Saved');
            setHistory([]);
        }
    };

    const handleBack = () => {
        // This back button will be imperfect for the sleep flow, but it's a start.
        setHistory(history.slice(0, -1));
        setValueChain([]); // Always reset value chain on back
    };

    // Auto-forwarding logic for non-sleep categories
    useEffect(() => {
        if (history.length > 0 && history[0] === 'Sleep') return; // Disable auto-forward for sleep flow

        const node = getNodeFromPath(history);
        if (node && !node.options) {
            const keys = Object.keys(node);
            if (keys.length === 1) {
                setHistory([...history, keys[0]]);
            }
        }
    }, [history, schema]);

    const nodeToRender = getNodeFromPath(history);
    if (!nodeToRender) return <div>Loading...</div>;

    const options = nodeToRender.options ? nodeToRender.options : Object.keys(nodeToRender);

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
