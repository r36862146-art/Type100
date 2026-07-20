import { supabase } from '@/lib/supabase/client';
import { User, Session, Provider } from '@supabase/supabase-js';
import { migrateGuestToCloud } from '../../sync/services/migration';

export const authService = {
  async signInWithEmail(email: string, password: string): Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user && !error) {
      await migrateGuestToCloud(data.user.id);
    }
    return { data, error };
  },

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });
    if (data?.user && !error) {
      await migrateGuestToCloud(data.user.id);
    }
    return { data, error };
  },

  async signInWithOAuth(provider: Provider): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  },

  async signInAsGuest(): Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }> {
    // Supabase Anonymous sign-in
    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  },

  async getSession(): Promise<{ data: { session: Session | null }; error: Error | null }> {
    return await supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
