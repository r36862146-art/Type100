'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { syncEngine } from '@/features/sync/services/syncEngine';
import { migrateGuestToCloud } from '@/features/sync/services/migration';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, loading: true });

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (_event === 'SIGNED_IN' && currentSession?.user) {
        await migrateGuestToCloud(currentSession.user.id);
      }
    });

    // We can also trigger sync engine here if we wanted
    // However syncEngine is a singleton and listens to online/offline globally.
    // Let's just ensure it's instantiated by importing it.

    return () => {
      subscription.unsubscribe();
      syncEngine.stopBackgroundSync(); // though it's global, just in case
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
