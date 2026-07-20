import { offlineQueue } from '../queue/offlineQueue';
import { supabase } from '@/lib/supabase/client';

export class SyncEngine {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      this.startBackgroundSync();
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.sync();
  };

  private handleOffline = () => {
    this.isOnline = false;
  };

  private startBackgroundSync() {
    // Attempt to sync every minute just in case
    this.intervalId = setInterval(() => {
      if (this.isOnline) {
        this.sync();
      }
    }, 60000);
  }

  public stopBackgroundSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  public async sync() {
    if (this.syncInProgress || !this.isOnline) return;
    this.syncInProgress = true;

    try {
      const items = await offlineQueue.peekAll();
      if (items.length === 0) {
        this.syncInProgress = false;
        return;
      }

      for (const item of items) {
        const { id, table, operation, payload } = item;
        let error = null;

        if (operation === 'INSERT') {
          const { error: err } = await supabase.from(table).insert(payload);
          error = err;
        } else if (operation === 'UPDATE') {
          const { error: err } = await supabase.from(table).update(payload).eq('id', payload.id);
          error = err;
        } else if (operation === 'DELETE') {
          const { error: err } = await supabase.from(table).delete().eq('id', payload.id);
          error = err;
        }

        // If success or duplicate key error, remove from queue
        // For actual conflict resolution, we'd fetch the remote row, resolve it, and update
        if (!error || error.code === '23505') { 
          await offlineQueue.remove(id);
        } else {
          console.error(`Sync error for ${table} (${operation}):`, error);
          // If error is related to network, we break and retry later
          if (error.message.includes('fetch') || error.message.includes('network')) {
            break;
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }
}

export const syncEngine = new SyncEngine();
