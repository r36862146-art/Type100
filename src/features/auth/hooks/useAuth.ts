import { useAuthContext } from '../providers/AuthProvider';
import { authService } from '../services/authService';

export function useAuth() {
  const context = useAuthContext();
  return { ...context, ...authService };
}
