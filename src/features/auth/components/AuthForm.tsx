import { useState } from 'react';
import { authService } from '../services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let res;
    if (isLogin) {
      res = await authService.signInWithEmail(email, password);
    } else {
      // Basic sign up, would ideally take a display name too
      res = await authService.signUpWithEmail(email, password, email.split('@')[0]);
    }

    if (res.error) {
      setError(res.error.message);
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    await authService.signInWithOAuth(provider);
  };

  const handleGuest = async () => {
    window.location.href = '/practice';
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>You are logged in as {user.email || 'Guest'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => authService.signOut()} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{isLogin ? 'Sign in' : 'Create an account'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Enter your email below to login to your account' : 'Enter your email below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleOAuth('github')}>
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline" onClick={() => handleOAuth('google')}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </Button>
        <Button variant="ghost" onClick={handleGuest} className="text-sm w-full">
          Continue as Guest
        </Button>
      </CardFooter>
    </Card>
  );
}
