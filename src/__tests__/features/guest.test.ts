import { localDb } from '@/lib/local-db/db';
import { migrateGuestToCloud } from '@/features/sync/services/migration';
import { supabase } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    upsert: jest.fn(),
  }
}));

describe('Guest Architecture', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // In a real jest DOM environment with fake indexedDB, we'd clear it here.
  });

  it('migrates guest sessions to cloud on login', async () => {
    // Mock localDb methods
    const mockSessions = [
      { id: '1', user_id: 'guest', wpm: 60, accuracy: 95, duration: 30, mode: 'words', timestamp: '2026-01-01' }
    ];
    jest.spyOn(localDb, 'getAllSessions').mockResolvedValue(mockSessions);
    jest.spyOn(localDb, 'clearSessions').mockResolvedValue(undefined);
    jest.spyOn(localDb, 'getSettings').mockResolvedValue(undefined);

    (supabase.from('typing_sessions').insert as jest.Mock).mockResolvedValue({ error: null });

    await migrateGuestToCloud('user-123');

    expect(localDb.getAllSessions).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('typing_sessions');
    expect(supabase.from('typing_sessions').insert).toHaveBeenCalledWith([
      { ...mockSessions[0], user_id: 'user-123' }
    ]);
    expect(localDb.clearSessions).toHaveBeenCalled();
  });
});
