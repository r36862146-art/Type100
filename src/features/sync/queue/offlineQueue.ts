import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SyncDB extends DBSchema {
  syncQueue: {
    key: string;
    value: {
      id: string;
      table: string;
      operation: 'INSERT' | 'UPDATE' | 'DELETE';
      payload: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

let dbPromise: Promise<IDBPDatabase<SyncDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<SyncDB>('type100-sync-db', 1, {
    upgrade(db: IDBPDatabase<SyncDB>) {
      const store = db.createObjectStore('syncQueue', { keyPath: 'id' });
      store.createIndex('by-timestamp', 'timestamp');
    },
  });
}

export const offlineQueue = {
  async enqueue(table: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) {
    if (!dbPromise) return;
    const db = await dbPromise;
    const item = {
      id: crypto.randomUUID(),
      table,
      operation,
      payload,
      timestamp: Date.now(),
    };
    await db.put('syncQueue', item);
  },

  async peekAll() {
    if (!dbPromise) return [];
    const db = await dbPromise;
    return db.getAllFromIndex('syncQueue', 'by-timestamp');
  },

  async remove(id: string) {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.delete('syncQueue', id);
  },

  async clear() {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.clear('syncQueue');
  }
};
