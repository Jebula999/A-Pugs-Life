import { schema as defaultSchema } from './schema';

const SCHEMA_KEY = 'dailyTrackerSchema';
const ENTRIES_KEY = 'dailyTrackerEntries';
const JOURNAL_ENTRIES_KEY = 'dailyTrackerJournalEntries';

// --- Schema ---
export const getSchema = () => {
  const storedSchema = localStorage.getItem(SCHEMA_KEY);
  if (storedSchema) {
    return JSON.parse(storedSchema);
  }
  // If no schema in local storage, initialize it with the default
  localStorage.setItem(SCHEMA_KEY, JSON.stringify(defaultSchema));
  return defaultSchema;
};

export const saveSchema = (newSchema) => {
  localStorage.setItem(SCHEMA_KEY, JSON.stringify(newSchema));
};

export const addOptionToSchema = (path, newOption) => {
  const schema = getSchema();
  let current = schema;
  // This path logic is simplified and might not work for all nested structures
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    current = current[key];
  }

  if (current && current.options && !current.options.includes(newOption)) {
    current.options.push(newOption);
    saveSchema(schema);
  }
};

// --- Tracked Entries ---
export const getEntries = () => {
  const entries = localStorage.getItem(ENTRIES_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const addEntry = (entry) => {
  const entries = getEntries();
  entries.push({ ...entry, timestamp: new Date().toISOString() });
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

// --- Journal Entries ---
export const getJournalEntries = () => {
  const entries = localStorage.getItem(JOURNAL_ENTRIES_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const addJournalEntry = (text) => {
  const entries = getJournalEntries();
  entries.push({ text, timestamp: new Date().toISOString() });
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
};
