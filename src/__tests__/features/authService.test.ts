import { authService } from '@/features/auth/services/authService';

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: '1' }, session: {} }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: '2' }, session: {} }, error: null }),
      signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }
}));

describe('Auth Service', () => {
  it('should sign in with email', async () => {
    const res = await authService.signInWithEmail('test@test.com', 'password');
    expect(res.error).toBeNull();
    expect(res.data.user).toBeDefined();
  });

  it('should sign up with email', async () => {
    const res = await authService.signUpWithEmail('test@test.com', 'password', 'Test User');
    expect(res.error).toBeNull();
    expect(res.data.user).toBeDefined();
  });
});
