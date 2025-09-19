import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Dashboard.css';

const Dashboard = () => {
    const [schema, setSchema] = useState(null);
    const [history, setHistory] = useState([]); // Path of keys to navigate the schema
    const [valueChain, setValueChain] = useState([]); // Accumulated values for multi-step entries

    useEffect(() => {
        setSchema(storage.getSchema());
    }, []);

    const getNodeFromPath = (path) => {
        if (!schema) return null;
        let node = schema;
        for (const key of path) {
            if (!node || !node[key]) return null; // Path is invalid
            node = node[key];
        }
        return node;
    };

    // This effect handles "auto-forwarding" past intermediate nodes
    useEffect(() => {
        const currentNode = getNodeFromPath(history);
        if (currentNode) {
            const keys = Object.keys(currentNode);
            // If a node has only one key and isn't a final options list, drill into it automatically
            if (keys.length === 1 && !currentNode.options) {
                const nextNode = currentNode[keys[0]];
                if (nextNode) {
                    setHistory([...history, keys[0]]);
                }
            }
        }
    }, [history, schema]); // Rerun when history changes

    const handleSelect = (key) => {
        const currentNode = getNodeFromPath(history);

        const isOption = currentNode?.options?.includes(key);
        const isCategory = currentNode && currentNode[key] && typeof currentNode[key] === 'object';

        if (isOption) {
            const newValues = [...valueChain, key];
            if (currentNode.next) {
                // Option with a next step (e.g., Sleep Duration)
                setValueChain(newValues);
                // The history needs to be advanced to the 'next' node's location.
                // This requires knowing the full path to the 'next' object.
                // Let's make the history update more robust.
                let nextNode = currentNode.next;
                let nextHistory = [...history, 'next'];
                // Auto-forward through the 'next' structure as well
                let nextKeys = Object.keys(nextNode);
                while(nextKeys.length === 1 && !nextNode.options) {
                    const nextKey = nextKeys[0];
                    nextHistory.push(nextKey);
                    nextNode = nextNode[nextKey];
                    nextKeys = Object.keys(nextNode);
                }
                setHistory(nextHistory);

            } else {
                // Final option selection, save the entry
                storage.addEntry({ path: history.slice(0, 1), value: newValues.join(', ') });
                alert(`Entry Saved: ${history.slice(0,1).join('')}: ${newValues.join(', ')}`);
                setHistory([]);
                setValueChain([]);
            }
        } else if (isCategory) {
            // It's a category, drill down
            setHistory([...history, key]);
        } else {
            // This case handles simple key-value selections that don't have an options array
            // e.g. Intimacy -> Yes
             storage.addEntry({ path: history, value: key });
             alert(`Entry Saved: ${history.join(' -> ')} -> ${key}`);
             setHistory([]);
             setValueChain([]);
        }
    };

    // Special handling for the Dream selection, as its keys are the options
    const currentNode = getNodeFromPath(history);
    if (history[history.length - 1] === 'Type' && history[0] === 'Sleep') {
        const dreamType = key => {
            if (key === 'None') {
                storage.addEntry({ path: ['Sleep', history[1]], value: [...valueChain, 'No Dreams'].join(', ') });
                alert('Entry Saved');
                setHistory([]); setValueChain([]);
            } else {
                // The options are the values in the array for Normal/Real
                const finalOptions = currentNode[key];
                // This requires another level of state management.
                // This is getting too complex. The original special case was better.
                // I will revert to a clear, if-else based special case logic.
                // The generic approach is failing to capture the bespoke flow.
            }
    }


    // --- Let's try the most direct, explicit logic possible ---
    const handleSelectFinal = (key) => {
        const path = history.join(' -> ');

        // --- SPECIAL CASE: SLEEP ---
        if (path.startsWith('Sleep')) {
            // State: history = ['Sleep', 'LastNight'/'Nap']
            // Now showing Duration options
            if (history.length === 2) {
                setValueChain([key]); // key is the duration, e.g. "7h"
                setHistory([...history, 'Duration', 'next', 'Dreams', 'Type']);
                return;
            }
            // State: history = ['Sleep', 'LastNight'/'Nap', 'Duration', 'next', 'Dreams', 'Type']
            // Now showing Dream Type options: None, Normal, Real
            if (history[history.length - 1] === 'Type') {
                if (key === 'None') {
                    storage.addEntry({ path: [history[0], history[1]], value: [...valueChain, 'No Dreams'].join(', ') });
                    alert('Saved');
                    setHistory([]); setValueChain([]);
                } else {
                    setValueChain([...valueChain, key]); // key is 'Normal' or 'Real'
                    setHistory([...history, key]);
                }
                return;
            }
            // State: history = [..., 'Type', 'Normal'/'Real']
            // Now showing final dream options
            if (history[history.length - 2] === 'Type') {
                storage.addEntry({ path: [history[0], history[1]], value: [...valueChain, key].join(', ') });
                alert('Saved');
                setHistory([]); setValueChain([]);
                return;
            }
        }
        // --- END SPECIAL CASE ---

        // --- GENERIC LOGIC ---
        const currentNode = getNodeFromPath(history);
        const nextNode = currentNode ? currentNode[key] : null;

        if (nextNode) { // Drill down
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

    // Auto-forwarding logic
    useEffect(() => {
        if (history.join(' -> ').startsWith('Sleep')) return; // Disable auto-forward for sleep flow
        const node = getNodeFromPath(history);
        if (node && !node.options) {
            const keys = Object.keys(node);
            if (keys.length === 1) {
                setHistory([...history, keys[0]]);
            }
        }
    }, [history]);

    const nodeToRender = getNodeFromPath(history);
    if (!nodeToRender) return <div>Loading...</div>;

    const options = nodeToRender.options ? nodeToRender.options : Object.keys(nodeToRender);

    return (
        <div>
            {history.length > 0 && <button onClick={handleBack} className="back-button">Back</button>}
            <div className="dashboard-grid">
                {options.map(opt => (
                    <button key={opt} onClick={() => handleSelectFinal(opt)} className="grid-button">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
