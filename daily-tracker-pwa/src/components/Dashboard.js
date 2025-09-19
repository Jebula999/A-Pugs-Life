import React, { useState, useEffect } from 'react';
import * as storage from '../storage';
import './Dashboard.css';

const Dashboard = () => {
    const [schema, setSchema] = useState(null);
    const [viewStack, setViewStack] = useState([]); // A stack to manage the view history
    const [valueChain, setValueChain] = useState([]);

    // Initialize state when schema loads
    useEffect(() => {
        const s = storage.getSchema();
        setSchema(s);
        setViewStack([s]); // Start with the root of the schema on the stack
    }, []);

    const getCurrentView = () => viewStack[viewStack.length - 1];

    const handleSelect = (key) => {
        const currentView = getCurrentView();
        const nextNode = currentView[key];

        // Case 1: The key is a category (an object without an 'options' key) -> Drill down
        if (nextNode && typeof nextNode === 'object' && !nextNode.options) {
            setViewStack([...viewStack, nextNode]); // Push new view onto stack
            return;
        }

        // Case 2: The key is an option from a list
        if (currentView.options && currentView.options.includes(key)) {
            const newValues = [...valueChain, key];

            // If there's a 'next' step, go to it
            if (currentView.next) {
                setValueChain(newValues);
                setViewStack([...viewStack, currentView.next]); // Push the 'next' view
            } else {
                // This is a final selection, so save the entry
                const path = [];
                // Reconstruct path from the view stack (this is complex, let's simplify for now)
                // A simpler way is to not store the full path, but just the top-level category.
                // This is a reasonable compromise for this app.
                // The first item on the stack (after root) is the top-level category.
                if (viewStack.length > 1) {
                    const root = schema;
                    const topLevelNode = viewStack[1];
                    const topLevelKey = Object.keys(root).find(k => root[k] === topLevelNode);
                    if(topLevelKey) path.push(topLevelKey);
                }

                storage.addEntry({ path: path, value: newValues.join(', ') });
                alert(`Entry Saved: ${path.join(' -> ')}: ${newValues.join(', ')}`);

                // Reset to the root view
                setViewStack([schema]);
                setValueChain([]);
            }
        }
    };

    const handleBack = () => {
        if (viewStack.length > 1) {
            // This is a simple back button. A more robust implementation
            // would need to handle the valueChain correctly when going back.
            // For now, we pop from the view stack.
            const newStack = [...viewStack];
            newStack.pop();
            setViewStack(newStack);
        }
    };

    if (!schema || viewStack.length === 0) {
        return <div>Loading...</div>;
    }

    const currentView = getCurrentView();
    const options = currentView.options ? currentView.options : Object.keys(currentView);

    return (
        <div>
            {viewStack.length > 1 && <button onClick={handleBack} className="back-button">Back</button>}
            <div className="dashboard-grid">
                {options.map(key => (
                    <button key={key} onClick={() => handleSelect(key)} className="grid-button">
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
