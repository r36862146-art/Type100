import { localDb } from '@/lib/local-db/db';
import { supabase } from '@/lib/supabase/client';

export const migrateGuestToCloud = async (userId: string) => {
  // 1. Migrate Practice Sessions
  const sessions = await localDb.getAllSessions();
  if (sessions.length > 0) {
    const payloads = sessions.map(s => ({
      ...s,
      user_id: userId
    }));

    // Insert all into supabase
    const { error } = await supabase.from('typing_sessions').insert(payloads);
    
    if (!error) {
      // Clear local sessions after successful sync, or keep them but maybe clear the queue
      await localDb.clearSessions();
    } else {
      console.error('Failed to migrate guest sessions to cloud:', error);
    }
  }

  // 2. Migrate Settings
  const settings = await localDb.getSettings();
  if (settings) {
    settings.user_id = userId;
    const { error } = await supabase.from('settings').upsert(settings);
    if (!error) {
      await localDb.clearSettings();
    } else {
      console.error('Failed to migrate guest settings to cloud:', error);
    }
  }

  // Future migrations for exam progress, personal bests, etc. would go here
};
