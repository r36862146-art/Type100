import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TypingSession, Settings } from '@/types/models';

interface Type100DB extends DBSchema {
  sessions: {
    key: string;
    value: TypingSession;
    indexes: { 'by-timestamp': string };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'type100-guest-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<Type100DB>> | null = null;

export const getDB = () => {
  if (typeof window === 'undefined') return null; // Avoid SSR issues
  if (!dbPromise) {
    dbPromise = openDB<Type100DB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const localDb = {
  // --- Sessions ---
  async saveSession(session: TypingSession) {
    const db = await getDB();
    if (!db) return;
    await db.put('sessions', session);
  },

  async getAllSessions(): Promise<TypingSession[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAllFromIndex('sessions', 'by-timestamp');
  },

  async clearSessions() {
    const db = await getDB();
    if (!db) return;
    await db.clear('sessions');
  },

  // --- Settings ---
  async saveSettings(settings: Settings) {
    const db = await getDB();
    if (!db) return;
    await db.put('settings', settings);
  },

  async getSettings(id: string = 'guest-settings'): Promise<Settings | undefined> {
    const db = await getDB();
    if (!db) return undefined;
    return db.get('settings', id);
  },

  async clearSettings() {
    const db = await getDB();
    if (!db) return;
    await db.clear('settings');
  }
};
